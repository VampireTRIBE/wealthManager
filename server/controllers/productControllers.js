const product = require("../models/product");
const productDetail = require("../models/productDetail");
const category = require("../models/category");
const dbReq = require("../utills/databaseReq/dbReq");

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
      const newProd = await product.create({
        ...newProduct,
        user: u_id,
        categories: c_id,
      });

      if (!transaction || transaction.quantity <= 0) {
        await product.deleteOne({ _id: newProd._id });
        return res.status(400).json({ error: "Invalid transaction quantity" });
      }

      const detail = await productDetail.create({
        ...transaction,
        product: newProd._id,
        type: "buy",
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
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = productsControllers;
