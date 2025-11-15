const mongoose = require("mongoose");
const AssetsCategory = require("../../../../../models/assets/assetsCat");
const AssetsStatement = require("../../../../../models/assets/assetsStatements");
const { computeIRR } = require("../../../../mathhelpers/xirr");

/**
 * @param {Array<{date: Date, value: number}>} cashflows
 */

async function updateStandaloneIRR(categoryIds = null) {
  try {
    const matchStage = categoryIds
    ? {
      category_id: {
        $in: categoryIds.map((id) => new mongoose.Types.ObjectId(id)),
      },
    }
    : {};
    const grouped = await AssetsStatement.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$category_id",
          cashflows: {
            $push: { date: "$date", type: "$type", amount: "$amount" },
          },
        },
      },
    ]);
    
    if (!grouped.length) {
      return { ok: true, updated: 0 };
    }
    
    const bulkOps = [];
    
    for (const cat of grouped) {
      const category = await AssetsCategory.findById(cat._id).lean();
      if (!category) continue;
      
      const cashflows = cat.cashflows
      .map((cf) => ({
        date: cf.date,
        amount: cf.type === "deposit" ? -cf.amount : cf.amount,
      }))
      .sort((a, b) => a.date - b.date);
      
      if (category.standaloneCurrentValue > 0) {
        cashflows.push({
          date: new Date(),
          amount: category.standaloneCurrentValue,
        });
      }
      
      const irr = computeIRR(cashflows);

      bulkOps.push({
        updateOne: {
          filter: { _id: cat._id },
          update: { $set: { standaloneIRR: irr, updatedAt: new Date() } },
        },
      });
    }

    if (!bulkOps.length) return { ok: true, updated: 0 };

    const result = await AssetsCategory.bulkWrite(bulkOps);

    return { ok: true, updated: result.modifiedCount };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

module.exports = updateStandaloneIRR;
