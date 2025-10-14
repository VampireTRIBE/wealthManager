const product = require("../models/product");
const productDetail = require("../models/productDetail");

const productDetailControllers = {
  async addDetail(req, res, next) {
    const { p_id } = req.params;
    const { transaction } = req.body;
    if (transaction["quantity"] <= 0) {
      return res.status(400).json({ error: "Quantity can't be 0 or less" });
    }
    try {
      await productDetail.create({
        ...transaction,
        product: p_id,
      });
      return res.status(200).json({ success: "Buy Transaction Completed" });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error"});
    }
  },
  
  async sellProduct(req, res, next) {
    const { p_id } = req.params;
    const { transaction } = req.body;
    const prod = await product.findById(p_id);
    if (transaction["quantity"] <= 0 || transaction["quantity"] > prod.qty) {
      return res.status(403).json({ error: "You have less Qty in Holdings"});
    }
    transaction["quantity"] = -transaction["quantity"];
    try {
      await productDetail.create({
        ...transaction,
        product: p_id,
      });
      return res.status(201).json({ success: "Sell Transaction Completed"});
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error"});
    }
  },
};

module.exports = productDetailControllers;
