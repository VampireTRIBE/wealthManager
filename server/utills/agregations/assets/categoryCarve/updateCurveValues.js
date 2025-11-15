const mongoose = require("mongoose");
const AssetsCategory = require("../../../../models/assets/assetsCat");
const AssetsCategoryCurves = require("../../../../models/assets/categoryCurve");

async function recordCategoryCurves(catIds, date = new Date()) {
  try {
    if (!Array.isArray(catIds) || catIds.length === 0) {
      return { success: false, message: "No category IDs provided" };
    }

    const curveDate = date instanceof Date ? new Date(date) : new Date(date);
    if (isNaN(curveDate.getTime())) {
      console.log("Invalid date detected:", date);
      return { success: false, message: "Invalid date provided" };
    }
    const startOfDay = new Date(curveDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const categoryData = await AssetsCategory.aggregate([
      { $match: { _id: { $in: catIds } } },
      {
        $project: {
          categoryName: "$name",
          category_id: "$_id",
          user: 1,
          standaloneCurrentValue: 1,
          consolidatedCurrentValue: 1,
          standaloneRealizedGain: 1,
          consolidatedRealizedGain: 1,
          standaloneUnrealizedGain: 1,
          consolidatedUnRealizedGain: 1,
          standaloneCash: 1,
          consolidatedCash: 1,
        },
      },
    ]);

    if (!categoryData.length) {
      return { success: false, message: "No categories found" };
    }

    const prevCurves = await AssetsCategoryCurves.find({
      category_id: { $in: catIds },
      date: { $lt: startOfDay },
    })
      .sort({ date: -1 })
      .lean();

    const prevCurveMap = {};
    for (const curve of prevCurves) {
      if (!prevCurveMap[curve.category_id.toString()]) {
        prevCurveMap[curve.category_id.toString()] = curve;
      }
    }

    const bulkOps = [];

    for (const cat of categoryData) {
      const standalonePL =
        (cat.standaloneRealizedGain ?? 0) + (cat.standaloneUnrealizedGain ?? 0);
      const consolidatedPL =
        (cat.consolidatedRealizedGain ?? 0) +
        (cat.consolidatedUnRealizedGain ?? 0);

      const prevCurve = prevCurveMap[cat._id.toString()];

      let standalonePLpercent = 0;
      let consolidatedPLpercent = 0;

      if (prevCurve) {
        standalonePLpercent =
          prevCurve.standaloneCurrentValue > 0
            ? ((standalonePL - prevCurve.standalonePL) /
                prevCurve.standaloneCurrentValue) *
              100
            : 0;

        consolidatedPLpercent =
          prevCurve.consolidatedCurrentValue > 0
            ? ((consolidatedPL - prevCurve.consolidatedPL) /
                prevCurve.consolidatedCurrentValue) *
              100
            : 0;
      }

      bulkOps.push({
        updateOne: {
          filter: {
            category_id: cat.category_id,
            date: { $gte: startOfDay, $lt: endOfDay },
          },
          update: {
            $set: {
              categoryName: cat.categoryName || "Unnamed Category",
              user: cat.user,
              standaloneCurrentValue:
                cat.standaloneCurrentValue + cat.standaloneCash ?? 0,
              standalonePL,
              standalonePLpercent,
              consolidatedCurrentValue:
                cat.consolidatedCurrentValue + cat.consolidatedCash ?? 0,
              consolidatedPL,
              consolidatedPLpercent,
              date: startOfDay,
            },
          },
          upsert: true,
        },
      });
    }

    let result = { upsertedCount: 0 };
    if (bulkOps.length > 0) {
      const bulkWriteResult = await AssetsCategoryCurves.bulkWrite(bulkOps);
      result.upsertedCount =
        bulkWriteResult.upsertedCount + bulkWriteResult.modifiedCount;
    }

    return { success: true, upsertedCount: result.upsertedCount };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = recordCategoryCurves;
