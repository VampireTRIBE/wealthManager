// utils/agregations/assets/categories/updateConsolidatedValues.js
const mongoose = require("mongoose");
const AssetsCategory = require("../../../../../models/assets/assetsCat");

async function updateConsolidatedValues(categoryId) {
  try {
    if (!categoryId) throw new Error("Category ID required");

    const currentId =
      typeof categoryId === "string"
        ? new mongoose.Types.ObjectId(categoryId)
        : categoryId;

    const visited = new Set();
    const updatesQueue = [];

    let current = await AssetsCategory.findById(currentId).lean();

    while (current && current._id && !visited.has(current._id.toString())) {
      visited.add(current._id.toString());
      updatesQueue.push(current._id);
      if (!current.parentCategory) break;
      current = await AssetsCategory.findById(current.parentCategory).lean();
    }

    for (const catId of updatesQueue) {
      const category = await AssetsCategory.findById(catId).lean();
      if (!category) continue;

      const childrenAgg = await AssetsCategory.aggregate([
        { $match: { parentCategory: catId } },
        {
          $group: {
            _id: null,
            consolidatedIvestmentValue: { $sum: "$consolidatedIvestmentValue" },
            consolidatedCurrentValue: { $sum: "$consolidatedCurrentValue" },
            consolidatedRealizedGain: { $sum: "$consolidatedRealizedGain" },
            consolidatedUnRealizedGain: { $sum: "$consolidatedUnRealizedGain" },
            consolidatedCurrentYearGain: { $sum: "$consolidatedCurrentYearGain" },
            consolidatedCash: { $sum: "$consolidatedCash" },
          },
        },
      ]);

      const childSums = childrenAgg[0] || {
        consolidatedIvestmentValue: 0,
        consolidatedCurrentValue: 0,
        consolidatedRealizedGain: 0,
        consolidatedUnRealizedGain: 0,
        consolidatedCurrentYearGain: 0,
        consolidatedCash: 0,
      };

      const updatedValues = {
        consolidatedIvestmentValue:
          Number(category.standaloneIvestmentValue || 0) +
          Number(childSums.consolidatedIvestmentValue || 0),
        consolidatedCurrentValue:
          Number(category.standaloneCurrentValue || 0) +
          Number(childSums.consolidatedCurrentValue || 0),
        consolidatedRealizedGain:
          Number(category.standaloneRealizedGain || 0) +
          Number(childSums.consolidatedRealizedGain || 0),
        consolidatedUnRealizedGain:
          Number(category.standaloneUnrealizedGain || 0) +
          Number(childSums.consolidatedUnRealizedGain || 0),
        consolidatedCurrentYearGain:
          Number(category.standaloneCurrentYearGain || 0) +
          Number(childSums.consolidatedCurrentYearGain || 0),
        consolidatedCash:
          Number(category.standaloneCash || 0) +
          Number(childSums.consolidatedCash || 0),
      };

      await AssetsCategory.updateOne({ _id: catId }, { $set: updatedValues });

      console.log(`✅ Updated consolidated values for ${category.name}`);
    }

    console.log("✅ Consolidated updates applied successfully");
  } catch (err) {
    console.error("❌ Error in updateConsolidatedValues:", err);
  }
}

module.exports = updateConsolidatedValues;
