const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const assetsProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    industry: { type: String },
    tags: [{ type: String }],
    buyAVG: { type: Number, default: 0 },
    qty: { type: Number, default: 0 },
    realizedGain: { type: Number, default: 0 },
    totalValue: { type: Number, default: 0 },
    unRealizedGain: { type: Number, default: 0 },
    currentYearGain: { type: Number, default: 0 },
    currentValue: { type: Number, default: 0 },
    IRR: { type: Number, default: 0 },
    dateADDED: { type: Date, default: Date.now },
    categories: { type: Schema.Types.ObjectId, ref: "assets" },
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("assetsproducts", assetsProductSchema);
