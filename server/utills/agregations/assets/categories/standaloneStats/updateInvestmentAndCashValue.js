const mongoose = require("mongoose");
const AssetsCategory = require("../../../../../models/assets/assetsCat");
const AssetsStatement = require("../../../../../models/assets/assetsStatements");

/**
 * @param {Object} tx - Transaction data (can be a document or plain object)
 * @param {"deposit"|"withdrawal"} tx.type - Transaction type
 * @param {mongoose.Types.ObjectId|string} tx.category_id - Category ID
 * @param {number} tx.amount - Transaction amount
 * @param {"add"|"remove"} [mode="add"] - Whether to apply or revert the change
 */
async function incrementStandaloneInvestmentAndCash(tx, mode = "add") {
  try {
    if (!tx?.category_id || !tx?.amount || !tx?.type) {
      throw new Error("Invalid transaction data");
    }

    const categoryId =
      typeof tx.category_id === "string"
        ? new mongoose.Types.ObjectId(tx.category_id)
        : tx.category_id;

    const sign = mode === "add" ? 1 : -1;

    let update = {};

    if (tx.type === "deposit") {
      update = {
        $inc: {
          standaloneIvestmentValue: sign * tx.amount,
          standaloneCash: sign * tx.amount,
        },
      };
    }

    else if (tx.type === "withdrawal") {
      update = {
        $inc: {
          standaloneIvestmentValue: -sign * tx.amount,
          standaloneCash: -sign * tx.amount,
        },
      };
    }

    else {
      throw new Error(`Unknown transaction type: ${tx.type}`);
    }

    const result = await AssetsCategory.updateOne(
      { _id: categoryId },
      update
    );

    return { ok: true, result };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

module.exports = incrementStandaloneInvestmentAndCash;
