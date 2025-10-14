const user = require("../models/user");
const axios = require("axios");

const product = require("../models/product");
const productDetail = require("../models/productDetail");
const custom_error = require("../utills/errors/custom_error");
const passport = require("passport");
const dbReq = require("../utills/databaseReq/dbReq");
const category = require("../models/category");
const { create } = require("connect-mongo");

const productsControllers = {
  async addNewProduct(req, res, next) {
    const { u_id, c_id } = req.params;
    const { newProduct, transaction } = req.body;
    try {
      const cat = await category.findById(c_id);
      if (cat.parentCategory === null) {
        return res.status(400).json({ error: "Can`t Create Product" });
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
      });
      if (!detail) {
        await product.deleteOne({ _id: newProd._id });
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.status(200).json({ success: "Buy Transaction Completed" });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async editProduct(req, res, next) {
    const { p_id } = req.params;
    const { newProduct } = req.body;
    try {
      await product.findByIdAndUpdate(p_id, {
        $set: newProduct,
      });

      return res.status(200).json({ success: "Product Edited" });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = productsControllers;
