const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    industry: { type: String },
    description: { type: String },

    buyAVG: { type: Number, default: 0 },
    qty: { type: Number, default: 0 },

    categories: [{ type: Schema.Types.ObjectId, ref: "categories" }],

    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("products", productSchema);
