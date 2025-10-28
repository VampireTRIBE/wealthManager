const mongoose = require("mongoose");
require("../../../../models/assets/assetsProduct");
require("../../../../models/assets/assetsTransactions");
const Product = mongoose.model("assetsproducts");
const Transactions = mongoose.model("assetstransactions");

function computeIRR(cashflows, guess = 0.1) {
  try {
    let rate = guess;
    const maxIter = 100;
    const tol = 1e-6;
    const t0 = cashflows[0].date.getTime();

    for (let i = 0; i < maxIter; i++) {
      let npv = 0,
        dnpv = 0;

      for (const { date, amount } of cashflows) {
        const t = (date.getTime() - t0) / 31557600000;
        const disc = Math.pow(1 + rate, t);
        npv += amount / disc;
        dnpv += (-t * amount) / (disc * (1 + rate));
      }

      if (dnpv === 0) return null;

      const newRate = rate - npv / dnpv;
      if (!isFinite(newRate)) return null;
      if (Math.abs(newRate - rate) < tol) return rate * 100;

      rate = newRate;
    }

    return null;
  } catch {
    return null;
  }
}

async function updateIRR(productId) {
  console.log("<----- IRR ----->");
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
