const mongoose = require("mongoose");
const AssetsCategory = require("../../../../../models/assets/assetsCat");
const AssetsStatement = require("../../../../../models/assets/assetsStatements");
const { computeIRR } = require("../../../../mathhelpers/xirr");

async function getAllSubCategoryIds(rootId) {
  const queue = [rootId];
  const allIds = new Set();

  while (queue.length > 0) {
    const id = queue.shift();
    allIds.add(id.toString());

    const children = await AssetsCategory.find(
      { parentCategory: id },
      { _id: 1 }
    ).lean();
    for (const child of children) {
      if (!allIds.has(child._id.toString())) queue.push(child._id);
    }
  }

  return [...allIds];
}

async function updateConsolidatedIRR(categoryId) {
  try {
    if (!categoryId) throw new Error("Category ID required");

    const allCategoryIds = await getAllSubCategoryIds(categoryId);

    const cashflows = await AssetsStatement.find({
      category_id: {
        $in: allCategoryIds.map((id) => new mongoose.Types.ObjectId(id)),
      },
    })
      .sort({ date: 1 })
      .lean();

    if (cashflows.length === 0) {
      await AssetsCategory.updateOne(
        { _id: categoryId },
        { $set: { consolidatedIRR: 0 } }
      );
      return;
    }

    const signedFlows = cashflows.map((txn) => ({
      date: txn.date,
      amount:
        txn.type === "deposit" ? -Math.abs(txn.amount) : Math.abs(txn.amount),
    }));

    const category = await AssetsCategory.findById(categoryId).lean();
    const finalValue = Number(category.consolidatedCurrentValue || 0);
    if (finalValue > 0) {
      signedFlows.push({
        date: new Date(),
        amount: finalValue,
      });
    }

    const irr = computeIRR(signedFlows);

    await AssetsCategory.updateOne(
      { _id: categoryId },
      { $set: { consolidatedIRR: irr } }
    );

    return irr * 100;
  } catch (err) {}
}

module.exports = updateConsolidatedIRR;
