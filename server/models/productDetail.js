const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productDetailsSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "products", required: true },
    quantity: { type: Number, required: true }, 
    buyPrice: { type: Number, required: true },
    buyDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

productDetailsSchema.pre("save", async function (next) {
  try {
    const Product = mongoose.model("products");
    const product = await Product.findById(this.product);
    if (!product) return next(new Error("Product not found"));

    if (this.quantity > 0) {
      const totalQty = product.qty + this.quantity;
      const totalCost =
        product.buyAVG * product.qty + this.buyPrice * this.quantity;
      const newAvg = totalQty === 0 ? 0 : totalCost / totalQty;

      product.qty = totalQty;
      product.buyAVG = newAvg;
      product.totalValue = totalQty * newAvg;
    }

    if (this.quantity < 0) {
      const sellQty = -this.quantity;
      const gain = (this.buyPrice - product.buyAVG) * sellQty;
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
