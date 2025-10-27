const axios = require("axios");
const MarketPrice = require("../../models/assets/marketPrice");

const marketPriceControllers = {
  async updateLTP(req, res, next) {
    try {
      const fetchLivePrices = async () => {
        try {
          const { data } = await axios.post(
            process.env.GOOGLE_SCRIPT_URL,
            {
              headers: {
                Authorization: `Bearer ${process.env.GOOGLE_SCRIPT_API_KEY}`,
              },
              timeout: 10000,
            }
          );

          if (!Array.isArray(data)) throw new Error("Invalid response format");
          return data;
        } catch (err) {
          console.error("⚠️ Failed to fetch live market prices:", err.message);
          return [];
        }
      };

      const livePrices = await fetchLivePrices();
      if (!Array.isArray(livePrices) || livePrices.length === 0) {
        return res.status(400).json({ error: "No price data received" });
      }

      await MarketPrice.bulkWrite(
        livePrices.map((p) => ({
          updateOne: {
            filter: { symbol: p.symbol },
            update: { $set: { LTP: p.LTP } },
            update: { $set: { CYSLTP: p.CYSLTP } },
            upsert: true,
          },
        }))
      );

      return res.status(200).json({
        success: "Market prices updated successfully",
        count: livePrices.length,
      });

    } catch (error) {
      console.error("🔥 Error updating prices:", error);
      return res.status(500).json({ error: "Server error" });
    }
  },
};

module.exports = marketPriceControllers;

