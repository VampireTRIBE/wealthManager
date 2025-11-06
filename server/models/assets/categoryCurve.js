const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const assetsCategoryCurveSchema = new Schema(
  {
    categoryName: { type: String, required: true },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "assetscategories",
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },

    date: { type: Date, default: Date.now },

    standaloneCurrentValue: { type: Number, required: true },
    standalonePL: { type: Number, required: true },
    standalonePLpercent: { type: Number, required: true },

    consolidatedCurrentValue: { type: Number, required: true },
    consolidatedPL: { type: Number, required: true },
    consolidatedPLpercent: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("assetsCategoryCurves", assetsCategoryCurveSchema);
