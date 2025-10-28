// utils/aggregations/assets/updateCurrentYearGains.js
const mongoose = require("mongoose");
const AssetsProduct = require("../../../../models/assets/assetsProduct");
const MarketPrice = require("../../../../models/assets/marketPrice");
const Transactions = require("../../../../models/assets/assetsTransactions");

/**
 * @param {Object} options - { userId?: string|ObjectId, productIds?: string[]|ObjectId[] }
 * @param {boolean} debug - If true, logs table of results.
 */
async function updateCurrentYearGains(options = {}, debug = false) {
  try {
    const { userId, productIds } = options;
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const matchStage = {};
    if (userId) {
      matchStage.user =
        typeof userId === "string"
          ? new mongoose.Types.ObjectId(userId)
          : userId;
    }
    if (productIds && productIds.length > 0) {
      matchStage._id = {
        $in: productIds.map((id) =>
          typeof id === "string" ? new mongoose.Types.ObjectId(id) : id
        ),
      };
    }

    console.log("⚙️ Running updateCurrentYearGains with filter:", matchStage);

    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: "marketprices",
          localField: "symbol",
          foreignField: "symbol",
          as: "mp",
        },
      },
      { $unwind: { path: "$mp", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "assetstransactions",
          let: { pid: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$product", "$$pid"] },
                type: "sell",
                Date: { $gte: startOfYear },
              },
            },
          ],
          as: "sellTxns",
        },
      },

      {
        $addFields: {
          realizedGainCY: {
            $sum: {
              $map: {
                input: "$sellTxns",
                as: "t",
                in: {
                  $multiply: [
                    { $subtract: ["$$t.Price", "$buyAVG"] },
                    "$$t.quantity",
                  ],
                },
              },
            },
          },
          unrealizedGainCY: {
            $cond: [
              { $gt: ["$qty", 0] },
              {
                $multiply: [
                  { $subtract: ["$mp.LTP", "$buyAVG"] },
                  "$qty",
                ],
              },
              0,
            ],
          },
        },
      },

      {
        $addFields: {
          currentYearGain: {
            $add: [
              { $ifNull: ["$realizedGainCY", 0] },
              { $ifNull: ["$unrealizedGainCY", 0] },
            ],
          },
          updatedAt: new Date(),
        },
      },

      { $project: { mp: 0, sellTxns: 0 } },

      {
        $merge: {
          into: "assetsproducts",
          on: "_id",
          whenMatched: "merge",
          whenNotMatched: "discard",
        },
      },
    ];

    const t0 = Date.now();
    await AssetsProduct.aggregate(pipeline, { allowDiskUse: true });
    const duration = Date.now() - t0;

    console.log(`✅ Current Year Gains updated successfully in ${duration}ms`);

    // --- Optional Debug Output ---
    if (debug) {
      const debugData = await AssetsProduct.aggregate([
        { $match: matchStage },
        {
          $lookup: {
            from: "marketprices",
            localField: "symbol",
            foreignField: "symbol",
            as: "mp",
          },
        },
        { $unwind: { path: "$mp", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            name: 1,
            symbol: 1,
            buyAVG: 1,
            qty: 1,
            LTP: "$mp.LTP",
            realizedGainCY: 1,
            unrealizedGainCY: 1,
            currentYearGain: 1,
            dateAdded: 1,
          },
        },
      ]);

      console.table(
        debugData.map((d) => ({
          Name: d.name,
          Symbol: d.symbol,
          BuyAVG: d.buyAVG,
          Qty: d.qty,
          LTP: d.LTP,
          RealizedCY: d.realizedGainCY,
          UnrealizedCY: d.unrealizedGainCY,
          TotalCY: d.currentYearGain,
          DateAdded: d.dateAdded
            ? new Date(d.dateAdded).toISOString().split("T")[0]
            : "-",
        }))
      );
    }

    return { ok: true, updatedAt: new Date(), duration };
  } catch (err) {
    console.error("❌ Error updating current year gains:", err);
    throw err;
  }
}

module.exports = updateCurrentYearGains;
