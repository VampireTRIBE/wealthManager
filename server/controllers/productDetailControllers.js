const product = require("../models/product");
const productDetail = require("../models/productDetail");
const dbReq = require("../utills/databaseReq/dbReq");

const productDetailControllers = {
  async addDetail(req, res, next) {
    const { p_id, u_id } = req.params;
    const { transaction } = req.body;
    if (transaction["quantity"] <= 0) {
      return res.status(400).json({ error: "Quantity can't be 0 or less" });
    }
    try {
      await productDetail.create({
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
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async sellProduct(req, res, next) {
    const { p_id, u_id } = req.params;
    const { transaction } = req.body;
    const prod = await product.findById(p_id);
    if (transaction["quantity"] <= 0 || transaction["quantity"] > prod.qty) {
      return res.status(403).json({ error: "You have less Qty in Holdings" });
    }
    try {
      await productDetail.create({
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

module.exports = productDetailControllers;
