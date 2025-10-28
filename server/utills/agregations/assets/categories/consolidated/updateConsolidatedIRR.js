// utils/agregations/assets/categories/updateConsolidatedIRR.js

const mongoose = require("mongoose");
const AssetsCategory = require("../../../../../models/assets/assetsCat");
const AssetsStatement = require("../../../../../models/assets/assetsStatements");

/**
 * Compute IRR using Newton-Raphson method
 */
function computeIRR(cashflows, guess = 0.1) {
  const maxIter = 100;
  const tol = 1e-6;

  let rate = guess;
  for (let i = 0; i < maxIter; i++) {
    let npv = 0;
    let dnpv = 0;

    for (let j = 0; j < cashflows.length; j++) {
      const t = (cashflows[j].date - cashflows[0].date) / (365 * 24 * 3600 * 1000);
      const cf = cashflows[j].amount;
      npv += cf / Math.pow(1 + rate, t);
      dnpv -= (t * cf) / Math.pow(1 + rate, t + 1);
    }

    const newRate = rate - npv / dnpv;
    if (Math.abs(newRate - rate) < tol) return rate;
    rate = newRate;
  }
  return rate;
}

/**
 * Get all subcategories recursively
 */
async function getAllSubCategoryIds(rootId) {
  const queue = [rootId];
  const allIds = new Set();

  while (queue.length > 0) {
    const id = queue.shift();
    allIds.add(id.toString());

    const children = await AssetsCategory.find({ parentCategory: id }, { _id: 1 }).lean();
    for (const child of children) {
      if (!allIds.has(child._id.toString())) queue.push(child._id);
    }
  }

  return [...allIds];
}

/**
 * Update consolidated IRR for a category
 */
async function updateConsolidatedIRR(categoryId) {
  try {
    if (!categoryId) throw new Error("Category ID required");

    const allCategoryIds = await getAllSubCategoryIds(categoryId);

    // 1️⃣ Get all cashflows from these categories
    const cashflows = await AssetsStatement.find({
      category_id: { $in: allCategoryIds.map(id => new mongoose.Types.ObjectId(id)) }
    }).sort({ date: 1 }).lean();

    if (cashflows.length === 0) {
      console.log(`No cashflows for category ${categoryId}`);
      return;
    }

    // 2️⃣ Convert deposits/withdrawals to signed cashflows
    const signedFlows = cashflows.map(txn => ({
      date: txn.date,
      amount: txn.type === "deposit" ? -Math.abs(txn.amount) : Math.abs(txn.amount),
    }));

    // 3️⃣ Add current value (consolidated) as last positive flow
    const category = await AssetsCategory.findById(categoryId).lean();
    const finalValue = Number(category.consolidatedCurrentValue || 0);
    if (finalValue > 0) {
      signedFlows.push({
        date: new Date(),
        amount: finalValue,
      });
    }

    // 4️⃣ Compute IRR
    const irr = computeIRR(signedFlows);
    const irrPercent = (irr * 100).toFixed(2);

    // 5️⃣ Update category
    await AssetsCategory.updateOne(
      { _id: categoryId },
      { $set: { consolidatedIRR: irrPercent } }
    );

    console.log(`✅ Consolidated IRR for ${category.name}: ${irrPercent}%`);
    return irrPercent;
  } catch (err) {
    console.error("❌ Error in updateConsolidatedIRR:", err);
  }
}

module.exports = updateConsolidatedIRR;
