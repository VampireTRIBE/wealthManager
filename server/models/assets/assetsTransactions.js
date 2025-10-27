const mongoose = require("mongoose");
const { updateConsolidatedCash } = require("../../utills/agregations/assets/agregations");
const Schema = mongoose.Schema;


const assetsTransactionsSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["buy", "sell"],
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "assetsproducts",
      required: true,
    },
    quantity: { type: Number, required: true },
    Price: { type: Number, required: true },
    Date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

assetsTransactionsSchema.pre("save", async function (next) {
  try {
    const Product = mongoose.model("assetsproducts");
    const Category = mongoose.model("assets");

    const product = await Product.findById(this.product);
    if (!product) return next(new Error("Product not found"));
    if (!product.categories)
      return next(new Error("Product category not found"));

    const category = await Category.findById(product.categories);
    if (!category) return next(new Error("Product category not found"));

    const price = this.Price;

    if (this.type === "buy") {
      const newQty = product.qty + this.quantity;
      const totalCost = product.buyAVG * product.qty + price * this.quantity;

      product.buyAVG = newQty === 0 ? 0 : totalCost / newQty;
      product.qty = newQty;
      product.totalValue = newQty * product.buyAVG;

      category.standaloneCash -= price * this.quantity;
    }

    if (this.type === "sell") {
      if (this.quantity > product.qty)
        return next(new Error("Not enough quantity to sell"));

      const gain = (price - product.buyAVG) * this.quantity;
      product.realizedGain += gain;
      product.qty -= this.quantity;
      product.totalValue = product.qty * product.buyAVG;

      category.standaloneCash += price * this.quantity;
    }

    await product.save();
    await category.save();

    await updateConsolidatedCash(category._id);

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("assetstransactions", assetsTransactionsSchema);
