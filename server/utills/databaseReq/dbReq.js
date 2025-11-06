const mongoose = require("mongoose");
const Category = require("../../models/assets/assetsCat");
const Product = require("../../models/assets/assetsProduct");
const MarketPrice = require("../../models/assets/marketPrice");
const User = require("../../models/user");
const Assets = require("../../models/assets/assetsCat");
const AssetsCategoryCurve = require("../../models/assets/categoryCurve");

const dbReq = {
  async userData(userId) {
    const objectId = new mongoose.Types.ObjectId(userId);

    // 1️⃣ Fetch all categories of this user in one go
    const categories = await Category.find({ user: objectId })
      .select(
        "_id name description parentCategory standaloneIvestmentValue consolidatedIvestmentValue standaloneCurrentValue consolidatedCurrentValue standaloneCash consolidatedCash standaloneRealizedGain consolidatedRealizedGain standaloneUnrealizedGain consolidatedUnRealizedGain standaloneCurrentYearGain consolidatedCurrentYearGain standaloneIRR consolidatedIRR"
      )
      .lean();

    // 2️⃣ Fetch all products of this user + join market price
    const products = await Product.aggregate([
      { $match: { user: objectId, qty: { $gt: 0 } } }, // ⬅️ Added qty > 0 filter
      {
        $lookup: {
          from: "marketprices",
          localField: "symbol",
          foreignField: "symbol",
          as: "marketData",
        },
      },
      {
        $addFields: {
          LTP: { $ifNull: [{ $arrayElemAt: ["$marketData.LTP", 0] }, 0] },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          industry: 1,
          tags: 1,
          qty: 1,
          buyAVG: 1,
          totalValue: 1,
          currentValue: 1,
          realizedGain: 1,
          unRealizedGain: 1,
          currentYearGain: 1,
          IRR: 1,
          categories: 1,
          LTP: 1,
        },
      },
    ]);

    // 3️⃣ Build product mapping by category ID
    const prodByCat = {};
    for (const p of products) {
      if (!p.categories) continue;
      const catId = String(p.categories);
      if (!prodByCat[catId]) prodByCat[catId] = [];
      prodByCat[catId].push(p);
    }

    // 4️⃣ Organize categories by parent
    const byParent = {};
    for (const c of categories) {
      const pid = c.parentCategory ? String(c.parentCategory) : "null";
      if (!byParent[pid]) byParent[pid] = [];
      byParent[pid].push(c);
    }

    // 5️⃣ Recursive tree builder
    function buildNode(cat, isTopLevel = false) {
      const children = byParent[String(cat._id)] || [];
      const subNodes = children.map((sc) => buildNode(sc, false));

      const baseDetails = {
        _id: cat._id,
        Name: cat.name,
        Description: cat.description,
      };

      const consolidated = {
        InvestmentValue: cat.consolidatedIvestmentValue,
        CurrentValue: cat.consolidatedCurrentValue,
        Cash: cat.consolidatedCash,
        RealizedGain: cat.consolidatedRealizedGain,
        UnrealizedGain: cat.consolidatedUnRealizedGain,
        CurrentYearGain: cat.consolidatedCurrentYearGain,
        Irr: cat.consolidatedIRR,
      };

      // Only include standalone + products for non-top-level categories
      if (isTopLevel) {
        return {
          ...baseDetails,
          consolidated,
          subCategories: subNodes,
        };
      }

      const standalone = {
        InvestmentValue: cat.standaloneIvestmentValue,
        CurrentValue: cat.standaloneCurrentValue,
        Cash: cat.standaloneCash,
        RealizedGain: cat.standaloneRealizedGain,
        UnrealizedGain: cat.standaloneUnrealizedGain,
        CurrentYearGain: cat.standaloneCurrentYearGain,
        Irr: cat.standaloneIRR,
      };

      return {
        ...baseDetails,
        standalone,
        consolidated,
        products: prodByCat[String(cat._id)] || [],
        subCategories: subNodes,
      };
    }

    // 6️⃣ Build top-level categories (no standalone or products)
    const roots = byParent["null"]?.map((r) => buildNode(r, true)) || [];

    // 7️⃣ Fetch user details
    const user = await User.findById(userId)
      .select("_id firstName lastName email")
      .lean();

    return {
      user,
      categories: roots,
      lastUpdated: new Date(),
    };
  },

  async getCategoryCurveData(userId) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const result = await Assets.aggregate([
      // 1️⃣ Find the root "ASSETS" category for this user
      {
        $match: {
          name: "ASSETS",
          parentCategory: null,
          user: userObjectId,
        },
      },
      {
        $project: { _id: 1, name: 1 },
      },

      // 2️⃣ Lookup all descendants (up to depth 3)
      {
        $graphLookup: {
          from: "assets",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "parentCategory",
          as: "descendants",
          maxDepth: 3,
        },
      },

      // 3️⃣ Combine root + descendants
      {
        $project: {
          allCategories: {
            $concatArrays: [
              [
                {
                  _id: "$_id",
                  name: "$name",
                },
              ],
              {
                $map: {
                  input: "$descendants",
                  as: "d",
                  in: { _id: "$$d._id", name: "$$d.name" },
                },
              },
            ],
          },
        },
      },

      // 4️⃣ Unwind to get each category individually
      { $unwind: "$allCategories" },

      // 5️⃣ Lookup curve data for each category for past one year
      {
        $lookup: {
          from: "assetscategorycurves",
          let: { catId: "$allCategories._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$category_id", "$$catId"] },
                    { $eq: ["$user", userObjectId] },
                    { $gte: ["$date", oneYearAgo] },
                  ],
                },
              },
            },
            { $sort: { date: 1 } },
            {
              $project: {
                _id: 0,
                date: 1,
                standaloneCurrentValue: 1,
                standalonePL: 1,
                standalonePLpercent: 1,
                consolidatedCurrentValue: 1,
                consolidatedPL: 1,
                consolidatedPLpercent: 1,
              },
            },
          ],
          as: "curveData",
        },
      },

      // 6️⃣ Format final output
      {
        $project: {
          _id: 0,
          categoryName: "$allCategories.name",
          category_id: "$allCategories._id",
          standalone: {
            $map: {
              input: "$curveData",
              as: "cd",
              in: {
                date: "$$cd.date",
                currentValue: "$$cd.standaloneCurrentValue",
                PL: "$$cd.standalonePL",
                PLpercent: "$$cd.standalonePLpercent",
              },
            },
          },
          consolidated: {
            $map: {
              input: "$curveData",
              as: "cd",
              in: {
                date: "$$cd.date",
                currentValue: "$$cd.consolidatedCurrentValue",
                PL: "$$cd.consolidatedPL",
                PLpercent: "$$cd.consolidatedPLpercent",
              },
            },
          },
        },
      },
    ]);

    return result;
  },
};

module.exports = dbReq;
