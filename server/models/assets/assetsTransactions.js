const mongoose = require("mongoose");
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
    if (this.type === "buy") {
      const lastBuy = await this.constructor
        .findOne({
          product: this.product,
          type: "buy",
        })
        .sort({ Date: -1 })
        .select("Date")
        .lean();

      if (lastBuy && this.Date < lastBuy.Date) {
        return next(
          new Error(
            `Buy transaction date (${this.Date.toDateString()}) cannot be before the last buy date (${new Date(
              lastBuy.Date
            ).toDateString()}).`
          )
        );
      }
    }

    const updateBuySellTransaction = require("../../utills/agregations/assets/products/updateQtyAvgTotalValue");
    await updateBuySellTransaction(this, { validateOnly: true });
    next();
  } catch (err) {
    next(err);
  }
});

assetsTransactionsSchema.post("save", async function () {
  const updateBuySellTransaction = require("../../utills/agregations/assets/products/updateQtyAvgTotalValue");

  // ✅ Apply real effects
  await updateBuySellTransaction(this);
});

module.exports = mongoose.model("assetstransactions", assetsTransactionsSchema);
