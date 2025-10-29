const mongoose = require("mongoose");
const AssetsCategory = require("../../../../models/assets/assetsCat");
const AssetsProduct = require("../../../../models/assets/assetsProduct");
const AssetsTransaction = require("../../../../models/assets/assetsTransactions");

/**
 * Handles buy/sell FIFO updates and validation.
 *
 * @param {Object} txn - Transaction document or plain object
 * @param {Object} [options]
 * @param {"add"|"remove"} [options.mode="add"] - Apply or revert
 * @param {boolean} [options.validateOnly=false] - If true, only validates FIFO (no writes)
 */
async function updateBuySellTransaction(txn, { mode = "add", validateOnly = false } = {}) {
  try {
    if (!txn?.product || !txn?.quantity || !txn?.Price || !txn?.type)
      throw new Error("Invalid transaction data");

    const productId =
      typeof txn.product === "string"
        ? new mongoose.Types.ObjectId(txn.product)
        : txn.product;

    const product = await AssetsProduct.findById(productId);
    if (!product) throw new Error("Product not found");

    const categoryId = product.categories;
    const { type, quantity, Price } = txn;
    const txnDate = new Date(txn.Date);
    if (isNaN(txnDate.getTime())) throw new Error("Invalid transaction date");
    const tradeValue = quantity * Price;

    // ============================================================
    // ✅ FIFO VALIDATION SECTION
    // ============================================================
    const allTxns = await AssetsTransaction.find({ product: productId })
      .sort({ Date: 1, createdAt: 1, _id: 1 }) // 💡 Tiebreaker: ensures stable FIFO order
      .lean();

    // --- Simulate existing ledger ---
    let runningQty = 0;
    for (const t of allTxns) {
      if (t.type === "buy") runningQty += t.quantity;
      else if (t.type === "sell") runningQty -= t.quantity;

      if (runningQty < 0)
        throw new Error("Invalid history: more sells than buys detected");
    }

    // --- Pre-validation (for pre-save hook) ---
    if (validateOnly) {
      const hypotheticalTxns = [...allTxns, txn].sort(
        (a, b) => new Date(a.Date) - new Date(b.Date)
      );

      let tempQty = 0;
      for (const t of hypotheticalTxns) {
        tempQty += t.type === "buy" ? t.quantity : -t.quantity;
        if (tempQty < 0)
          throw new Error(`FIFO check failed: attempting to sell before enough buys`);
      }

      return true; // ✅ Valid transaction
    }

    // ============================================================
    // 🧮 APPLY UPDATES (only for post-save)
    // ============================================================
    let realizedGain = 0;

    if (type === "buy") {
      // Weighted average buy update
      const totalCost = product.buyAVG * product.qty + tradeValue * (mode === "add" ? 1 : -1);
      const newQty = product.qty + (mode === "add" ? quantity : -quantity);
      product.buyAVG = newQty > 0 ? totalCost / newQty : 0;
      product.qty = newQty;
    } else if (type === "sell") {
      // --- FIFO Sell Logic ---
      const buyTxns = await AssetsTransaction.find({
        product: productId,
        type: "buy",
        Date: { $lte: txnDate },
      })
        .sort({ Date: 1, createdAt: 1, _id: 1 }) // 💡 stable FIFO order
        .lean();

      let remainingSellQty = quantity;
      let gain = 0;

      for (const bt of buyTxns) {
        if (remainingSellQty <= 0) break;
        const qtyToSell = Math.min(bt.quantity, remainingSellQty);
        gain += (Price - bt.Price) * qtyToSell;
        remainingSellQty -= qtyToSell;
      }

      if (remainingSellQty > 0)
        throw new Error(`FIFO mismatch: not enough buy quantity to sell ${quantity}`);

      realizedGain = gain;
      product.realizedGain += realizedGain;
      product.qty -= quantity;
    }

    // --- Update total value ---
    product.totalValue = product.qty * product.buyAVG;

    // --- Reset metadata if holdings cleared ---
    if (product.qty === 0) {
      product.description = "";
      product.industry = "";
      product.tags = [];
      product.buyAVG = 0;
      product.totalValue = 0;
      product.unRealizedGain = 0;
      product.currentValue = 0;
      product.currentYearGain = 0;
    }

    await product.save();

    // ============================================================
    // 💰 CATEGORY-LEVEL UPDATES
    // ============================================================
    const update = { $inc: {} };

    if (type === "buy") {
      update.$inc.standaloneCash = -tradeValue;
    } else if (type === "sell") {
      update.$inc.standaloneCash = tradeValue;
      update.$inc.standaloneRealizedGain = realizedGain;
    }

    await AssetsCategory.updateOne({ _id: categoryId }, update);

    console.log(
      `✅ ${validateOnly ? "Validated" : "Applied"} ${type.toUpperCase()} txn | 
       Product: ${product.symbol || product._id} | Qty: ${quantity} | 
       ΔCash: ${update.$inc.standaloneCash.toFixed(2)}`
    );

    return { ok: true };
  } catch (err) {
    console.error("❌ updateBuySellTransaction Error:", err.message);
    if (validateOnly) throw err;
    return { ok: false, error: err.message };
  }
}

module.exports = updateBuySellTransaction;
