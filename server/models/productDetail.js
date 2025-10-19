const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productDetailsSchema = new Schema(
  {
    type: { type: String, required: true }, // 'buy' or 'sell'
    product: { type: Schema.Types.ObjectId, ref: "products", required: true },
    quantity: { type: Number, required: true },
    Price: { type: Number, required: true }, // Use Price instead of buyPrice
    Date: { type: Date, default: Date.now }, // Use Date instead of buyDate
  },
  { timestamps: true }
);

productDetailsSchema.pre("save", async function (next) {
  try {
    const Product = mongoose.model("products");
    const product = await Product.findById(this.product);
    if (!product) return next(new Error("Product not found"));

    if (this.type === "buy" && this.quantity > 0) {
      const totalQty = product.qty + this.quantity;
      const totalCost = product.buyAVG * product.qty + this.Price * this.quantity;
      const newAvg = totalQty === 0 ? 0 : totalCost / totalQty;

      product.qty = totalQty;
      product.buyAVG = newAvg;
      product.totalValue = totalQty * newAvg;
    }

    if (this.type === "sell" && this.quantity > 0) {
      const sellQty = this.quantity;
      const gain = (this.Price - product.buyAVG) * sellQty;
      product.realizedGain = (product.realizedGain || 0) + gain;

      product.qty -= sellQty;
      product.totalValue = product.qty * product.buyAVG;
    }

    await product.save();
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("productDetails", productDetailsSchema);
