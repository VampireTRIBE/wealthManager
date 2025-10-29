const mongoose = require("mongoose");
const AssetsProduct = require("../../../../models/assets/assetsProduct");

const LOCK_COLLECTION = "locks"; 
const LOCK_ID = "updateAllCurrentValues_lock";
const LOCK_TTL_MS = 1000 * 60 * 5; 
const SYMBOL_BATCH_SIZE = 200; 

async function acquireLock(db) {
  try {
    const lockDoc = {
      _id: LOCK_ID,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + LOCK_TTL_MS),
    };

    const coll = db.collection(LOCK_COLLECTION);
    await coll.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

    await coll.insertOne(lockDoc);
    return true;
  } catch (err) {
    if (err && err.code === 11000) {
      return false;
    }
    throw err;
  }
}

async function releaseLock(db) {
  try {
    const coll = db.collection(LOCK_COLLECTION);
    await coll.deleteOne({ _id: LOCK_ID });
  } catch (err) {
    console.warn("Warning: failed to release lock", err);
  }
}

function chunks(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function updateAllCurrentValues(changedSymbols = [], options = {}) {
  if (!Array.isArray(changedSymbols) || changedSymbols.length === 0) {
    return { ok: true, message: "No changed symbols" };
  }
  const db = mongoose.connection.db;
  const gotLock = await acquireLock(db);
  if (!gotLock) {
    return { ok: false, message: "lock_active" };
  }

  const t0 = Date.now();
  let batchesProcessed = 0;
  try {
    try {
      await AssetsProduct.collection.createIndex({ symbol: 1 });
      await AssetsProduct.collection.createIndex({ user: 1 });
    } catch (idxErr) {
      console.warn("Could not create index (may already exist):", idxErr);
    }

    const symbolBatches = chunks(changedSymbols, SYMBOL_BATCH_SIZE);
    for (const batch of symbolBatches) {
      const match = { symbol: { $in: batch } };
      if (options.userId) {
        match.user = typeof options.userId === "string" ? 
          mongoose.Types.ObjectId(options.userId) : options.userId;
      }
      await AssetsProduct.aggregate([
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
      ], { allowDiskUse: true });

      batchesProcessed++;
    }
    const durationMs = Date.now() - t0;
    await releaseLock(db);
    return { ok: true, totalBatches: symbolBatches.length, batchesProcessed, durationMs };
  } catch (err) {
    try { await releaseLock(db); } catch (_) {}
    throw err;
  }
}

module.exports = updateAllCurrentValues;
