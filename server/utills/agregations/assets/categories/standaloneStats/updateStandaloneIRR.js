const mongoose = require("mongoose");
const AssetsCategory = require("../../../../../models/assets/assetsCat");
const AssetsStatement = require("../../../../../models/assets/assetsStatements");

/**
 * @param {Array<{date: Date, value: number}>} cashflows
 * @returns {number} IRR (as decimal, e.g. 0.12 = 12%)
 */
function computeIRR(cashflows, guess = 0.1) {
  if (!cashflows || cashflows.length < 2) return 0;

  const maxIter = 100;
  const tol = 1e-7;
  let rate = guess;
  const t0 = cashflows[0].date.getTime();

  for (let i = 0; i < maxIter; i++) {
    let npv = 0;
    let dnpv = 0;

    for (const { date, value } of cashflows) {
      const days = (date.getTime() - t0) / (1000 * 60 * 60 * 24);
      const frac = days / 365;
      const factor = Math.pow(1 + rate, frac);

      npv += value / factor;
      dnpv += (-frac * value) / (factor * (1 + rate));
    }

    const newRate = rate - npv / dnpv;
    if (Math.abs(newRate - rate) < tol) break;
    rate = newRate;
  }

  return rate;
}

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
          value: cf.type === "deposit" ? -cf.amount : cf.amount,
        }))
        .sort((a, b) => a.date - b.date);

      if (category.standaloneCurrentValue > 0) {
        cashflows.push({
          date: new Date(),
          value: category.standaloneCurrentValue,
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
