const assetsCatModel = require("../../models/assets/assetsCat");
const productModel = require("../../models/assets/assetsProduct");
const transactionModel = require("../../models/assets/assetsTransactions");
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
        .select("categories -_id")
        .lean();
      const category = await assetsCatModel
        .findById(categoryId?.categories)
        .select("standaloneCash -_id")
        .lean();

      if (
        transaction["quantity"] * transaction["Price"] >
        category?.standaloneCash
      ) {
        return res.status(400).json({ error: "Insuffient Funds" });
      }

      await transactionModel.create({
        ...transaction,
        product: p_id,
        type: "buy",
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
      console.log(error.message);
      return res.status(500).json({ error: "Internal Server Error" });
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
      await transactionModel.create({
        ...transaction,
        product: p_id,
        type: "sell",
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
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = transactionControllers;
