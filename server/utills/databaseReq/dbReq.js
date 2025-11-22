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
    const categories = await Category.find({ user: objectId })
      .select(
        "_id name description parentCategory standaloneIvestmentValue consolidatedIvestmentValue standaloneCurrentValue consolidatedCurrentValue standaloneCash consolidatedCash standaloneRealizedGain consolidatedRealizedGain standaloneUnrealizedGain consolidatedUnRealizedGain standaloneCurrentYearGain consolidatedCurrentYearGain standaloneIRR consolidatedIRR"
      )
      .lean();

    const products = await Product.aggregate([
      { $match: { user: objectId, qty: { $gt: 0 } } },
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

    const prodByCat = {};
    for (const p of products) {
      if (!p.categories) continue;
      const catId = String(p.categories);
      if (!prodByCat[catId]) prodByCat[catId] = [];
      prodByCat[catId].push(p);
    }

    const byParent = {};
    for (const c of categories) {
      const pid = c.parentCategory ? String(c.parentCategory) : "null";
      if (!byParent[pid]) byParent[pid] = [];
      byParent[pid].push(c);
    }

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

    const roots = byParent["null"]?.map((r) => buildNode(r, true)) || [];

    const user = await User.findById(userId)
      .select("_id firstName lastName email")
      .lean();

    return {
      user,
      categories: roots,
      lastUpdated: new Date(),
    };
  },

  async getCategoryCurveData(userId, days = 365) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days); 

    const result = await Assets.aggregate([
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

      { $unwind: "$allCategories" },

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
                    { $gte: ["$date", fromDate] },
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
