const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productDetailsSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "products", required: true },

    quantity: { type: Number, required: true, min: 1 },
    buyPrice: { type: Number, required: true, min: 0 },
    buyDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("productDetails", productDetailsSchema);
