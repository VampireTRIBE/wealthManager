const axios = require("axios");
const MarketPrice = require("../../models/assets/marketPrice");
const updateAllCurrentValues = require("../../utills/agregations/assets/products/updateCurrentValueUnrealizedGain");

const marketPriceControllers = {
  async updateLTP(req, res, next) {
    try {
      const summary = await updateLivePrices();
      return res.status(200).json(summary);
    } catch (err) {
      console.error("🔥 updateLTP Controller Error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  },
};

async function updateLivePrices() {
  try {
    console.log(" -> Running background live price update...");
    const { data: livePrices } = await axios
      .post(process.env.GOOGLE_SCRIPT_URL, {
        headers: {
          Authorization: `Bearer ${process.env.GOOGLE_SCRIPT_API_KEY}`,
        },
        timeout: 20000,
      })
      .catch((err) => {
        console.warn(" -> Error fetching live prices:", err.message);
        return { data: [] };
      });

    if (!Array.isArray(livePrices) || livePrices.length === 0) {
      console.warn(" -> No price data received");
      return { success: false, message: "No price data received" };
    }

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
      return {
        success: true,
      };
    }

    console.log(" -> No LTP changes detected");
    return {
      success: true,
      message: "Market prices updated (no LTP changes)",
      updatedSymbols: 0,
      totalReceived: normalized.length,
    };
  } catch (error) {
    console.error(" -> updateLivePrices() Error:", error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  ...marketPriceControllers,
  updateLivePrices,
};
