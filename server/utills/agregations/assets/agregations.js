const mongoose = require("mongoose");
const { Types } = mongoose;

const aggregations = {
  updateConsolidatedCash: async function (categoryId) {
    if (!categoryId) throw new Error("categoryId required");

    // Lazy-load model to avoid circular dependency
    const Category = require("../../../models/assets/assetsCat");

    const _id = new Types.ObjectId(categoryId);

    // 1️⃣ Get category + ancestors
    const rootWithAncestors = await Category.aggregate([
      { $match: { _id } },
      {
        $graphLookup: {
          from: "assets",
          startWith: "$parentCategory",
          connectFromField: "parentCategory",
          connectToField: "_id",
          as: "ancestors",
        },
      },
      { $project: { _id: 1, ancestors: { _id: 1 } } },
    ]);

    if (!rootWithAncestors.length) return;

    const ancestors = rootWithAncestors[0].ancestors || [];
    const affectedIds = [_id, ...ancestors.map((a) => a._id)];

    // 2️⃣ Calculate consolidatedCash
    const sums = await Category.aggregate([
      { $match: { _id: { $in: affectedIds } } },
      {
        $graphLookup: {
          from: "assets",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "parentCategory",
          as: "descendants",
        },
      },
      {
        $addFields: {
          allNodes: { $concatArrays: [["$$ROOT"], "$descendants"] },
        },
      },
      {
        $addFields: {
          consolidatedCash: { $sum: "$allNodes.standaloneCash" },
        },
      },
      { $project: { _id: 1, consolidatedCash: 1 } },
    ]);

    // 3️⃣ Bulk update
    const bulkOps = sums.map((s) => ({
      updateOne: { filter: { _id: s._id }, update: { $set: { consolidatedCash: s.consolidatedCash } } },
    }));

    if (bulkOps.length) await Category.bulkWrite(bulkOps);

    return sums;
  },
};

module.exports = aggregations;
