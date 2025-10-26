// utils/updateCashGraph.js
const mongoose = require("mongoose");
const Category = require("../../../models/assets/assetsCat"); 
const { Types } = mongoose;

async function updateConsolidatedCashUsingGraphLookup(categoryId) {
  if (!categoryId) throw new Error("categoryId required");
  const _id = Types.ObjectId(categoryId);

  const rootWithAncestors = await Category.aggregate([
    { $match: { _id } },
    {
      $graphLookup: {
        from: "assets",                
        startWith: "$parentCategory", 
        connectFromField: "parentCategory",
        connectToField: "_id",
        as: "ancestors",
        depthField: "ancestorDepth"
      }
    },
    {
      $project: {
        _id: 1,
        ancestors: { _id: 1 }
      }
    }
  ]);

  if (!rootWithAncestors || rootWithAncestors.length === 0) {
    return;
  }

  const ancestors = rootWithAncestors[0].ancestors || [];
  const affectedIds = [ _id, ...ancestors.map(a => a._id) ];

  const sums = await Category.aggregate([
    { $match: { _id: { $in: affectedIds } } },
    {
      $graphLookup: {
        from: "assets",
        startWith: "$_id",
        connectFromField: "_id",
        connectToField: "parentCategory",
        as: "descendants",
      }
    },

    {
      $addFields: {
        descendantStandaloneArray: {
          $map: {
            input: "$descendants",
            as: "d",
            in: { $ifNull: ["$$d.standaloneCash", 0] }
          }
        }
      }
    },
    {
      $addFields: {
        subtreeSum: {
          $sum: {
            $concatArrays: ["$descendantStandaloneArray", ["$standaloneCash"]]
          }
        }
      }
    },

    { $project: { _id: 1, subtreeSum: 1 } }
  ]);

  const bulkOps = sums.map(s => ({
    updateOne: {
      filter: { _id: s._id },
      update: { $set: { consolidatedCash: s.subtreeSum } }
    }
  }));

  if (bulkOps.length) {
    await Category.bulkWrite(bulkOps);
  }

  return sums;
}

module.exports = updateConsolidatedCashUsingGraphLookup;
