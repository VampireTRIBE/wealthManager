const mongoose = require("mongoose");
const AssetsProduct = require("../../../../models/assets/assetsProduct");

/**
 * @param {Object} options - { userId?: string, productIds?: string[]|ObjectId[] }
 */
async function updateCurrentValuesByFilter(options = {}, debug = false) {
  try {
    const { userId, productIds } = options;
    const match = {};
    if (userId) {
      match.user =
        typeof userId === "string"
          ? new mongoose.Types.ObjectId(userId)
          : userId;
    }
    if (productIds && productIds.length > 0) {
      match._id = {
        $in: productIds.map((id) =>
          typeof id === "string" ? new mongoose.Types.ObjectId(id) : id
        ),
      };
    }

    try {
      await AssetsProduct.collection.createIndex({ symbol: 1 });
      await AssetsProduct.collection.createIndex({ user: 1 });
    } catch (idxErr) {}

    const pipeline = [
      { $match: match },

      {
        $lookup: {
          from: "marketprices",
          localField: "symbol",
          foreignField: "symbol",
          as: "mp",
        },
      },
      {
        $set: {
          mp: { $arrayElemAt: ["$mp", 0] },
          qty: { $ifNull: ["$qty", 0] },
          buyAVG: { $ifNull: ["$buyAVG", 0] },
        },
      },
      {
        $set: {
          currentValue: {
            $round: [
              { $multiply: ["$qty", { $ifNull: ["$mp.LTP", "$buyAVG"] }] },
              2,
            ],
          },
          unRealizedGain: {
            $round: [
              {
                $subtract: [
                  { $multiply: ["$qty", { $ifNull: ["$mp.LTP", "$buyAVG"] }] },
                  { $multiply: ["$qty", "$buyAVG"] },
                ],
              },
              2,
            ],
          },
          updatedAt: new Date(),
        },
      },
      { $project: { mp: 0 } },
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

    if (debug) {
      const updated = await AssetsProduct.find(match)
        .select("symbol currentValue unRealizedGain buyAVG qty updatedAt")
        .lean();
      console.table(updated);
    }

    return { ok: true, updatedAt: new Date(), duration };
  } catch (err) {
    throw err;
  }
}

module.exports = updateCurrentValuesByFilter;
