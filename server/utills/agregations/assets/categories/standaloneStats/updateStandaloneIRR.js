// utils/agregations/assets/category/updateStandaloneIRR.js

const mongoose = require("mongoose");
const AssetsCategory = require("../../../../../models/assets/assetsCat");
const AssetsStatement = require("../../../../../models/assets/assetsStatements");

/**
 * Compute IRR numerically via Newton-Raphson
 * @param {Array<{date: Date, value: number}>} cashflows
 * @returns {number} IRR (as decimal, e.g. 0.12 = 12%)
 */
function computeIRR(cashflows, guess = 0.1) {
  if (!cashflows || cashflows.length < 2) return 0;

  const maxIter = 100;
  const tol = 1e-6;
  let rate = guess;

  for (let i = 0; i < maxIter; i++) {
    let npv = 0;
    let dnpv = 0;

    const t0 = cashflows[0].date.getTime();

    for (const { date, value } of cashflows) {
      const years = (date.getTime() - t0) / (1000 * 60 * 60 * 24 * 365);
      const discount = Math.pow(1 + rate, years);
      npv += value / discount;
      dnpv += (-years * value) / (discount * (1 + rate));
    }

    const newRate = rate - npv / dnpv;
    if (Math.abs(newRate - rate) < tol) return newRate;
    rate = newRate;
  }

  return rate;
}

/**
 * Updates standaloneIRR for each category
 * by computing IRR from assetsStatements and standaloneInvestmentValue.
 */
async function updateStandaloneIRR(categoryIds = null) {
  try {
    const matchStage = categoryIds
      ? { category_id: { $in: categoryIds.map((id) => new mongoose.Types.ObjectId(id)) } }
      : {};

    // 🔹 Step 1: Get all statements grouped by category
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
      console.log("⚠️ No cashflow statements found for IRR update.");
      return { ok: true, updated: 0 };
    }

    const bulkOps = [];

    for (const cat of grouped) {
      const category = await AssetsCategory.findById(cat._id).lean();
      if (!category) continue;

      const cashflows = cat.cashflows
        .map((cf) => ({
          date: cf.date,
          // 💸 Deposits = outflow (negative), Withdrawals = inflow (positive)
          value: cf.type === "deposit" ? -cf.amount : cf.amount,
        }))
        .sort((a, b) => a.date - b.date);

      // 🔹 Add final investment value as last inflow
      if (category.standaloneIvestmentValue > 0) {
        cashflows.push({
          date: new Date(),
          value: category.standaloneIvestmentValue,
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

    console.log(`✅ Updated standaloneIRR for ${result.modifiedCount} categories`);
    return { ok: true, updated: result.modifiedCount };
  } catch (err) {
    console.error("❌ Error in updateStandaloneIRR:", err);
    return { ok: false, error: err.message };
  }
}

module.exports = updateStandaloneIRR;
