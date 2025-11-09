const mongoose = require("mongoose");
const AssetsCategory = require("../../../../../models/assets/assetsCat");
const AssetsProduct = require("../../../../../models/assets/assetsProduct");

/**
 * @param {mongoose.Types.ObjectId[]|string[]} [categoryIds=null]
 */
async function updateStandaloneGains(categoryIds = null) {
  try {
    const matchStage = {};

    if (categoryIds) {
      matchStage.categories = {
        $in: categoryIds.map((id) => new mongoose.Types.ObjectId(id)),
      };
    }

    const categoriesToUpdate = await AssetsCategory.aggregate([
      {
        $lookup: {
          from: "assetsproducts",
          localField: "_id",
          foreignField: "categories",
          as: "products",
        },
      },
      { $unwind: "$products" },
      {
        $match: {
          ...(categoryIds ? { _id: { $in: categoryIds.map((id) => new mongoose.Types.ObjectId(id)) } } : {}),
          $expr: { $gt: ["$products.updatedAt", "$updatedAt"] },
        },
      },
      { $group: { _id: "$_id" } },
    ]);

    if (!categoriesToUpdate.length) {
      return { ok: true, updated: 0, skipped: true };
    }

    const categoryIdsToUpdate = categoriesToUpdate.map((c) => c._id);
    const agg = await AssetsProduct.aggregate([
      { $match: { categories: { $in: categoryIdsToUpdate } } },
      {
        $group: {
          _id: "$categories",
          totalUnrealized: { $sum: "$unRealizedGain" },
          totalCYGain: { $sum: "$currentYearGain" },
        },
      },
    ]);

    const bulkOps = agg.map((cat) => ({
      updateOne: {
        filter: { _id: cat._id },
        update: [
          {
            $set: {
              standaloneUnrealizedGain: cat.totalUnrealized,
              standaloneCurrentYearGain: cat.totalCYGain,
              standaloneCurrentValue: {
                $add: [
                  "$standaloneIvestmentValue",
                  "$standaloneRealizedGain",
                  cat.totalUnrealized,
                ],
              },
              updatedAt: new Date(),
            },
          },
        ],
      },
    }));

    const result = await AssetsCategory.bulkWrite(bulkOps);
    return { ok: true, updated: result.modifiedCount, skipped: false };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

module.exports = updateStandaloneGains;
