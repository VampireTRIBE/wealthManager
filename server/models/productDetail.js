const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productDetailSchema = new Schema({
  quantity: {
    type: Number,
    required: true,
    min: 0.000001,
  },
  buyPrice: {
    type: Number,
    required: true,
    min: 0.000001,
  },
  buyDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "product",
  },
});

const productDetail = mongoose.model("productDetail", productDetailSchema);
module.exports = productDetail;
