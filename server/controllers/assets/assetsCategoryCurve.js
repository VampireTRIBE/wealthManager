const MarketPrice = require("../../models/assets/marketPrice");
const axios = require("axios");

async function updateCurveValues() {
  try {
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

    console.log("<----- Starting Past Curve Value Updates ----->");

    const { data } = await axios
      .post(process.env.GOOGLE_SCRIPT_URL2, {
        headers: {
          Authorization: `Bearer ${process.env.GOOGLE_SCRIPT_API_KEY}`,
        },
        timeout: 30000,
      })
      .catch((err) => {
        console.warn("<----- Error fetching live prices ----->", err.message);
        return { data: [] };
      });

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

    console.log("<----- All Dates Updated Successfully ----->");
    return { success: true };
  } catch (error) {
    console.error(`<----- updateCurveValues() Error: ${error} ----->`);
    return { success: false, error: error.message };
  }
}

module.exports = updateCurveValues;
