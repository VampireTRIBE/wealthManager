const mongoose = require("mongoose");
require("../../../../models/assets/assetsProduct");
require("../../../../models/assets/assetsTransactions");
const Product = mongoose.model("assetsproducts");
const Transactions = mongoose.model("assetstransactions");
const { computeIRR } = require("../../../mathhelpers/xirr");

async function updateIRR(productId) {
  const product = await Product.findById(productId)
    .select("currentValue qty")
    .lean();

  if (!product) return;
  if (product.currentValue <= 0) {
    await Product.updateOne({ _id: productId }, { $set: { IRR: 0 } });
    return;
  }

  const txns = await Transactions.find({ product: productId })
    .select("type quantity Price Date")
    .sort({ Date: 1 })
    .lean();

  if (!txns.length) {
    return await Product.updateOne({ _id: productId }, { $set: { IRR: 0 } });
  }

  const cashflows = txns.map((txn) => ({
    date: txn.Date,
    amount:
      txn.type === "buy"
        ? -(txn.Price * txn.quantity)
        : +(txn.Price * txn.quantity),
  }));

  cashflows.push({
    date: new Date(),
    amount: product.currentValue,
  });

  const irr = computeIRR(cashflows);
  const safeIRR = isFinite(irr) ? irr : 0;
  await Product.updateOne({ _id: productId }, { $set: { IRR: safeIRR } });
}
module.exports = { updateIRR };
