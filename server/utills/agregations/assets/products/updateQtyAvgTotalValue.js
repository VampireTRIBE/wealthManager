const mongoose = require("mongoose");
const AssetsCategory = require("../../../../models/assets/assetsCat");
const AssetsProduct = require("../../../../models/assets/assetsProduct");
const AssetsTransaction = require("../../../../models/assets/assetsTransactions");

/**
 * Handles incremental updates on buy/sell:
 *  - Updates product holdings (qty, avg, realized gain)
 *  - Updates category standaloneCash & standaloneRealizedGain
 *
 * @param {Object} txn - Transaction document or plain object
 * @param {"buy"|"sell"} txn.type - Transaction type
 * @param {mongoose.Types.ObjectId|string} txn.product - Product ID
 * @param {number} txn.quantity - Quantity
 * @param {number} txn.Price - Transaction price
 * @param {"add"|"remove"} [mode="add"] - Apply or revert the effect
 */
async function updateBuySellTransaction(txn, mode = "add") {
  try {
    if (!txn?.product || !txn?.quantity || !txn?.Price || !txn?.type)
      throw new Error("Invalid transaction data");

    const productId =
      typeof txn.product === "string"
        ? new mongoose.Types.ObjectId(txn.product)
        : txn.product;

    // 🔹 Fetch product with category
    const product = await AssetsProduct.findById(productId);
    if (!product?.categories)
      throw new Error(`Product ${productId} missing category reference`);

    const categoryId = product.categories;
    const { type, quantity, Price } = txn;
    const tradeValue = quantity * Price;
    const sign = mode === "add" ? 1 : -1;

    // ===========================
    // 🧮 PRODUCT-LEVEL UPDATES
    // ===========================
    let realizedGain = 0;

    if (type === "buy") {
      // New weighted average price
      const newQty = product.qty + sign * quantity;
      const totalCost = product.buyAVG * product.qty + sign * tradeValue;

      if (newQty > 0) {
        product.buyAVG = totalCost / newQty;
      }
      product.qty = newQty;
    } else if (type === "sell") {
      // Calculate realized gain
      realizedGain = (Price - product.buyAVG) * quantity * sign;
      product.qty -= sign * quantity;
      product.realizedGain = (product.realizedGain || 0) + realizedGain;
    } else {
      throw new Error(`Unknown transaction type: ${type}`);
    }

    // Update product total value
    product.totalValue = product.qty * product.buyAVG;
    await product.save();

    // ===========================
    // 💰 CATEGORY-LEVEL UPDATES
    // ===========================
    const update = { $inc: {} };

    if (type === "buy") {
      update.$inc.standaloneCash = -sign * tradeValue;
    } else if (type === "sell") {
      update.$inc.standaloneCash = sign * tradeValue;
      update.$inc.standaloneRealizedGain = realizedGain;
    }

    await AssetsCategory.updateOne({ _id: categoryId }, update);

    console.log(
      `✅ ${mode === "add" ? "Applied" : "Reverted"} ${type.toUpperCase()} txn | 
       Product: ${product.symbol || product._id} | 
       ΔCash: ${update.$inc.standaloneCash.toFixed(2)}${
        update.$inc.standaloneRealizedGain
          ? ` | ΔRealizedGain: ${update.$inc.standaloneRealizedGain.toFixed(2)}`
          : ""
      }`
    );

    return { ok: true, productId, categoryId, result: update };
  } catch (err) {
    console.error("❌ Error in updateBuySellTransaction:", err);
    return { ok: false, error: err.message };
  }
}

module.exports = updateBuySellTransaction;
