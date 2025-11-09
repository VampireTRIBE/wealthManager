const MarketPrice = require("../../models/assets/marketPrice");
const axios = require("axios");
const log = require("../../utills/logers/logger");
const assetsCatModel = require("../../models/assets/assetsCat");
const updateCurrentValuesByFilter = require("../../utills/agregations/assets/products/updateCurrentValueUnrealizedGainFilter");
const updateCurrentYearGains = require("../../utills/agregations/assets/products/updateCurrentYearGains");
const updateStandaloneGains = require("../../utills/agregations/assets/categories/standaloneStats/updateCurrentvalueUnrealizedGainCurrentYearGain");
const {
  getAllSubCategoryIds,
  getLeafCategoryIds,
} = require("../../utills/agregations/assets/findsAllCategoryIDs");
const updateConsolidatedValues = require("../../utills/agregations/assets/categories/consolidated/updateConsolidatedValues");
const recordCategoryCurves = require("../../utills/agregations/assets/categoryCarve/updateCurveValues");

async function updateCurveValues() {
  try {
    log.running("PAST CURVE VALUE UPDATE");
    log.waiting("PAST DATA");

    const { data } = await axios
      .post(process.env.GOOGLE_SCRIPT_URL2, {
        headers: {
          Authorization: `Bearer ${process.env.GOOGLE_SCRIPT_API_KEY}`,
        },
        timeout: 30000,
      })
      .catch((err) => {
        log.error(`PAST DATA NOT FOUND > ${err.message}`);
        return { data: [] };
      });

    data.length == 0 ? log.info("[] DATA") : log.success("DATA FOUND");

    const user_id1 = "68fe8c2389ae1387ed9484a8";
    const rootAssetsCategoryId = await assetsCatModel
      .findOne({ name: "ASSETS", parentCategory: null }, { _id: 1 })
      .lean();
    const assetsSubCategoriesIDs = await getAllSubCategoryIds(user_id1);

    for (const day of data) {
      const livePrices = day.data;
      if (!Array.isArray(livePrices) || livePrices.length === 0) {
        continue;
      }
      const normalized = livePrices.map((p) => ({
        symbol: String(p.symbol).toUpperCase(),
        LTP: Number(p.ltp ?? 0),
      }));

      const bulkPriceOps = normalized.map((p) => ({
        updateOne: {
          filter: { symbol: p.symbol },
          update: { $set: { LTP: p.LTP } },
          upsert: true,
        },
      }));

      if (bulkPriceOps.length > 0) {
        await MarketPrice.bulkWrite(bulkPriceOps, { ordered: false });
      }

      await updateCurrentValuesByFilter({ userId: user_id1 });
      await updateCurrentYearGains({ userId: user_id1 });
      await updateStandaloneGains(assetsSubCategoriesIDs);

      const leafcategorys = await getLeafCategoryIds(user_id1);
      for (const catid of leafcategorys) {
        await updateConsolidatedValues(catid);
      }

      await updateConsolidatedValues(rootAssetsCategoryId?._id);
      assetsSubCategoriesIDs.push(rootAssetsCategoryId._id);
      await recordCategoryCurves(assetsSubCategoriesIDs, day.date);
      assetsSubCategoriesIDs.pop();
    }
    log.success("PAST CURVE VALUE UPDATE COMPLETED");
    return { success: true };
  } catch (error) {
    log.error(`PAST CURVE VALUE UPDATE FAILED > ERROR : > ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
}

module.exports = updateCurveValues;
