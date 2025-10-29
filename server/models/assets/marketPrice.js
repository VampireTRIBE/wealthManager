const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const marketPriceSchema = new Schema(
  {
    symbol: { type: String, required: true },
    LTP: { type: Number, default: 0 },
    CYSLTP: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("marketprices", marketPriceSchema);
