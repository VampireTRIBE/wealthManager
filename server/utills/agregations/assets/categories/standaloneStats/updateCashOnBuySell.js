const mongoose = require("mongoose");
const AssetsCategory = require("../../../../../models/assets/assetsCat");
const AssetsProduct = require("../../../../../models/assets/assetsProduct");

/**
 * Incrementally updates standaloneCash and standaloneRealizedGain when buy/sell happens.
 *
 * @param {Object} txn - Transaction document or plain object
 * @param {"buy"|"sell"} txn.type - Transaction type
 * @param {mongoose.Types.ObjectId|string} txn.product - Product ID
 * @param {number} txn.quantity - Quantity
 * @param {number} txn.Price - Transaction price
 * @param {"add"|"remove"} [mode="add"] - Apply or revert the effect
 */
async function updateCashOnBuySell(txn, mode = "add") {
  try {
    if (!txn?.product || !txn?.quantity || !txn?.Price || !txn?.type)
      throw new Error("Invalid transaction data");

    // 🔹 Convert product ID
    const productId =
      typeof txn.product === "string"
        ? new mongoose.Types.ObjectId(txn.product)
        : txn.product;

    // 🔹 Fetch product details to know category + avg cost
    const product = await AssetsProduct.findById(productId).lean();
    if (!product?.categories)
      throw new Error(`Product ${productId} missing category reference`);

    const categoryId = product.categories;
    const buyAVG = product.buyAVG || 0;

    // 🔹 Calculate transaction value
    const txnValue = txn.quantity * txn.Price;
    const sign = mode === "add" ? 1 : -1;

    // 🔹 Prepare base update
    const update = { $inc: {} };

    if (txn.type === "buy") {
      // 💸 Buy reduces cash
      update.$inc.standaloneCash = -sign * txnValue;
    } else if (txn.type === "sell") {
      // 💰 Sell increases cash
      update.$inc.standaloneCash = sign * txnValue;

      // 📈 Also update realized gain
      const realizedGain = (txn.Price - buyAVG) * txn.quantity;
      update.$inc.standaloneRealizedGain = sign * realizedGain;
    } else {
      throw new Error(`Unknown transaction type: ${txn.type}`);
    }

    // 🔹 Apply update to the corresponding category
    const result = await AssetsCategory.updateOne({ _id: categoryId }, update);

    console.log(
      `✅ [${txn.type.toUpperCase()}] ${
        mode === "add" ? "Applied" : "Reverted"
      } | Category: ${categoryId} | Δ Cash: ${update.$inc.standaloneCash}${
        update.$inc.standaloneRealizedGain
          ? ` | Δ RealizedGain: ${update.$inc.standaloneRealizedGain}`
          : ""
      }`
    );

    return { ok: true, result };
  } catch (err) {
    console.error("❌ Error in updateCashOnBuySell:", err);
    return { ok: false, error: err.message };
  }
}

module.exports = updateCashOnBuySell;
