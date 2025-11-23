const axios = require("axios");
const MarketPrice = require("../../models/assets/marketPrice");
const recordCategoryCurves = require("../../utills/agregations/assets/categoryCarve/updateCurveValues");
const log = require("../../utills/logers/logger");

const marketPriceControllers = {
  async updateLTP(req, res, next) {
    const { u_id } = req.params;
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
      const dbReq = require("../../utills/databaseReq/dbReq");
      const updateConsolidatedIRR = require("../../utills/agregations/assets/categories/consolidated/updateConsolidatedIRR");

      const rootAssetsCategoryId = await assetsCatModel
        .findOne({ name: "ASSETS", parentCategory: null, user: u_id }, { _id: 1 })
        .lean();
      const assetsSubCategoriesIDs = await getAllSubCategoryIds(u_id);

      await updateCurrentValuesByFilter({ userId: u_id });
      await updateCurrentYearGains({ userId: u_id });
      await updateStandaloneGains(assetsSubCategoriesIDs);

      const leafcategorys = await getLeafCategoryIds(u_id);
      for (const catid of leafcategorys) {
        await updateConsolidatedValues(catid);
      }

      await updateConsolidatedValues(rootAssetsCategoryId?._id);
      await updateConsolidatedIRR(rootAssetsCategoryId?._id);
      assetsSubCategoriesIDs.push(rootAssetsCategoryId._id);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await recordCategoryCurves(assetsSubCategoriesIDs, today);

      const [c_data, u_data] = await Promise.all([
        dbReq.getCategoryCurveData(u_id, 90),
        dbReq.userData(u_id),
      ]);

      if (!u_data) {
        return res.status(404).json({ error: "User data not found" });
      }
      return res.status(200).json({
        success: "successful",
        userID: u_id,
        Data: u_data,
        CData: c_data,
      });
    } catch (err) {
      console.error("🔥 updateLTP Controller Error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  },
};

async function updateLivePrices() {
  try {
    log.running("LIVE LTP UPDATE");
    log.waiting("LIVE LTP DATA");
    const { data: livePrices } = await axios
      .post(process.env.GOOGLE_SCRIPT_URL, {
        headers: {
          Authorization: `Bearer ${process.env.GOOGLE_SCRIPT_API_KEY}`,
        },
        timeout: 20000,
      })
      .catch((err) => {
        log.error(`DATA NOT FOUND > ${err.message}`);
        return { data: [] };
      });
    if (!Array.isArray(livePrices) || livePrices.length === 0) {
      log.info("NO LTP DATA FOUND");
      return { success: false, message: "No price data received" };
    }
    log.success("LTP DATA FOUND");
    const normalized = livePrices.map((p) => ({
      symbol: String(p.symbol).toUpperCase(),
      LTP: Number(p.LTP ?? 0),
      CYSLTP: Number(p.CYSLTP ?? 0),
    }));

    const symbols = [...new Set(normalized.map((p) => p.symbol))];

    const existingPrices = await MarketPrice.find({
      symbol: { $in: symbols },
    })
      .select({ symbol: 1, LTP: 1 })
      .lean();

    const existingMap = new Map(existingPrices.map((e) => [e.symbol, e.LTP]));

    const changedSymbols = [];
    const bulkPriceOps = normalized.map((p) => {
      const oldLTP = existingMap.has(p.symbol)
        ? existingMap.get(p.symbol)
        : null;
      const ltpChanged = oldLTP === null || Number(oldLTP) !== Number(p.LTP);
      if (ltpChanged) changedSymbols.push(p.symbol);

      return {
        updateOne: {
          filter: { symbol: p.symbol },
          update: { $set: { LTP: p.LTP, CYSLTP: p.CYSLTP } },
          upsert: true,
        },
      };
    });

    if (bulkPriceOps.length > 0) {
      await MarketPrice.bulkWrite(bulkPriceOps, { ordered: false });
      log.success("LIVE LTP UPDATE COMPLETED");
      return {
        success: true,
      };
    }
    log.success("LIVE LTP UPDATE COMPLETED");
    return {
      success: true,
      message: "Market prices updated (no LTP changes)",
      updatedSymbols: 0,
      totalReceived: normalized.length,
    };
  } catch (error) {
    log.error(`LIVE LTP UPDATE FAILED > Error : ${error.message}`);
    return { success: false, error: error.message };
  }
}

module.exports = {
  ...marketPriceControllers,
  updateLivePrices,
};
