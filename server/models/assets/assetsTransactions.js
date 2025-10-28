const mongoose = require("mongoose");
const updateCurrentValuesByFilter = require("../../utills/agregations/assets/products/updateCurrentValueUnrealizedGainFilter");
const updateCurrentYearGains = require("../../utills/agregations/assets/products/updateCurrentYearGains");
const updateBuySellTransaction = require("../../utills/agregations/assets/products/updateQtyAvgTotalValue");
const updateStandaloneGains = require("../../utills/agregations/assets/categories/standaloneStats/updateCurrentvalueUnrealizedGainCurrentYearGain");
const updateConsolidatedValues = require("../../utills/agregations/assets/categories/consolidated/updateConsolidatedValues");
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

assetsTransactionsSchema.post("save", async function () {
  await updateBuySellTransaction(this);
  await updateCurrentValuesByFilter({ productIds: [this.product] });
  await updateCurrentYearGains({ productIds: [this.product] });
  const AssetsProduct = require("./assetsProduct");
  const res = await AssetsProduct.findById(this.product, { categories: 1 });
  await updateStandaloneGains([res.categories]);
  await updateConsolidatedValues([res.categories]);
});

module.exports = mongoose.model("assetstransactions", assetsTransactionsSchema);
