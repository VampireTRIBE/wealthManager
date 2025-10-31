const assetsCatModel = require("../../models/assets/assetsCat");
const productModel = require("../../models/assets/assetsProduct");
const transactionModel = require("../../models/assets/assetsTransactions");
const validateStandaloneCashOnDate = require("../../utills/agregations/assets/categories/standaloneStats/validateStandaloneCashOnDate");
const dbReq = require("../../utills/databaseReq/dbReq");

const transactionControllers = {
  async addDetail(req, res, next) {
    const { p_id, u_id } = req.params;
    const { transaction } = req.body;
    try {
      if (transaction["quantity"] <= 0) {
        return res.status(400).json({ error: "Quantity can't be 0 or less" });
      }
      const categoryId = await productModel
        .findById(p_id)
        .select("categories dateADDED -_id")
        .lean();

      const category = await assetsCatModel
        .findById(categoryId?.categories)
        .select("standaloneCash -_id")
        .lean();

      const txnDate = new Date(transaction["Date"]);
      if (isNaN(txnDate.getTime())) {
        return res.status(400).json({ error: "Invalid transaction date" });
      }

      const now = new Date();
      if (txnDate > now) {
        return res.status(400).json({ error: "Can't buy in a future date" });
      }

      if (txnDate < new Date(categoryId.dateADDED)) {
        return res.status(400).json({
          error: "Transaction date can't be before product creation date",
        });
      }

      if (
        transaction["quantity"] * transaction["Price"] >
        category?.standaloneCash
      ) {
        return res.status(400).json({ error: "Insuffient Funds" });
      }
      const requiredAmount = transaction["Price"] * transaction["quantity"];
      const availableCash = await validateStandaloneCashOnDate({
        category_id: categoryId?.categories,
        date: txnDate,
      });

      if (availableCash < requiredAmount) {
        return res.status(400).json({
          error: `Insufficient standalone cash on ${txnDate.toDateString()}. Available: ${availableCash}, Required: ${requiredAmount}`,
        });
      }
      await transactionModel.create({
        ...transaction,
        product: p_id,
        type: "buy",
        category_id: categoryId?.categories,
      });
      const u_data = await dbReq.userData(u_id);
      if (!u_data) {
        return res.status(404).json({ error: "User data not found" });
      }
      return res.status(200).json({
        success: "successful",
        userID: u_id,
        Data: u_data,
      });
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: error.message });
    }
  },

  async sellProduct(req, res, next) {
    const { p_id, u_id } = req.params;
    const { transaction } = req.body;
    const prod = await productModel.findById(p_id);
    if (transaction["quantity"] <= 0 || transaction["quantity"] > prod.qty) {
      return res.status(403).json({ error: "You have less Qty in Holdings" });
    }
    try {
      const categoryId = await productModel
        .findById(p_id)
        .select("categories dateADDED -_id")
        .lean();
      await transactionModel.create({
        ...transaction,
        product: p_id,
        type: "sell",
        category_id: categoryId?.categories,
      });
      const u_data = await dbReq.userData(u_id);
      if (!u_data) {
        return res.status(404).json({ error: "User data not found" });
      }
      return res.status(200).json({
        success: "successful",
        userID: u_id,
        Data: u_data,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message});
    }
  },
};

module.exports = transactionControllers;
