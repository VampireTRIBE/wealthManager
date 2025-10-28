// utils/agregations/assets/category/updateStandaloneGains.js

const mongoose = require("mongoose");
const AssetsCategory = require("../../../../../models/assets/assetsCat");
const AssetsProduct = require("../../../../../models/assets/assetsProduct");

/**
 * Incrementally updates standaloneUnrealizedGain, standaloneCurrentYearGain,
 * and standaloneCurrentValue for categories that have products updated recently.
 *
 * @param {mongoose.Types.ObjectId[]|string[]} [categoryIds=null]
 *   Optional: update only these category IDs.
 */
async function updateStandaloneGains(categoryIds = null) {
  try {
    const matchStage = {};

    if (categoryIds) {
      matchStage.categories = {
        $in: categoryIds.map((id) => new mongoose.Types.ObjectId(id)),
      };
    }

    // 🔹 Step 1: Find categories whose related products were updated after the category
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
      console.log("✅ No category changes detected — already up to date.");
      return { ok: true, updated: 0, skipped: true };
    }

    const categoryIdsToUpdate = categoriesToUpdate.map((c) => c._id);

    // 🔹 Step 2: Aggregate new gain values from their products
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

    // 🔹 Step 3: Prepare bulk update operations
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
              updatedAt: new Date(), // refresh update time
            },
          },
        ],
      },
    }));

    const result = await AssetsCategory.bulkWrite(bulkOps);

    console.log(`✅ Incrementally updated ${result.modifiedCount} categories`);
    return { ok: true, updated: result.modifiedCount, skipped: false };
  } catch (err) {
    console.error("❌ Error in incremental updateStandaloneGains:", err);
    return { ok: false, error: err.message };
  }
}

module.exports = updateStandaloneGains;
