const product = require("../../models/assets/assetsProduct");
const productDetail = require("../../models/assets/assetsTransactions");
const category = require("../../models/assets/assetsCat");
const dbReq = require("../../utills/databaseReq/dbReq");
const validateStandaloneCashOnDate = require("../../utills/agregations/assets/categories/standaloneStats/validateStandaloneCashOnDate");

const productsControllers = {
  async addNewProduct(req, res, next) {
    const { u_id, c_id } = req.params;
    const { newProduct, transaction } = req.body;
    try {
      const cat = await category.findById(c_id);
      if (cat.parentCategory === null) {
        return res
          .status(400)
          .json({ error: "Can`t Create Product in Default Category" });
      }
      const txnDate = new Date(transaction["Date"]);

      if (isNaN(txnDate.getTime())) {
        return res.status(400).json({ error: "Invalid transaction date" });
      }

      if (txnDate > new Date()) {
        return res.status(400).json({ error: "Can't buy in a future date" });
      }
      if (
        transaction["quantity"] * transaction["Price"] >
        cat?.standaloneCash
      ) {
        return res.status(400).json({ error: "Insuffient Funds" });
      }
      const requiredAmount = transaction["Price"] * transaction["quantity"];
      const availableCash = await validateStandaloneCashOnDate({
        category_id: c_id,
        date: txnDate,
      });
      if (availableCash < requiredAmount) {
        return res.status(400).json({
          error: `Insufficient standalone cash on ${txnDate.toDateString()}. Available: ${availableCash}, Required: ${requiredAmount}`,
        });
      }

      if (!transaction || transaction.quantity <= 0) {
        return res.status(400).json({ error: "Invalid transaction quantity" });
      }

      const newProd = await product.create({
        ...newProduct,
        user: u_id,
        categories: c_id,
        dateADDED: transaction["Date"],
        symbol: newProduct["name"],
      });

      const detail = await productDetail.create({
        ...transaction,
        product: newProd._id,
        type: "buy",
        category_id:c_id,
      });
      if (!detail) {
        await product.deleteOne({ _id: newProd._id });
        return res.status(500).json({ error: "Internal Server Error" });
      }
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
      return res.status(500).json({ error: error.message });
    }
  },

  async editProduct(req, res, next) {
    const { p_id } = req.params;
    const { newProduct } = req.body;
    try {
      await product.findByIdAndUpdate(p_id, {
        $set: newProduct,
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
      return res.status(500).json({ error: error.message });
    }
  },
};

module.exports = productsControllers;
