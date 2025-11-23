const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const assetsTransactionsSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["buy", "sell"],
      required: true,
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "assetscategories",
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

assetsTransactionsSchema.index({ category_id: 1, Date: 1 });

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
  const assetsCatModel = require("../../models/assets/assetsCat");
  const updateBuySellTransaction = require("../../utills/agregations/assets/products/updateQtyAvgTotalValue");
  const updateCurrentYearGains = require("../../utills/agregations/assets/products/updateCurrentYearGains");
  const updateCurrentValuesByFilter = require("../../utills/agregations/assets/products/updateCurrentValueUnrealizedGainFilter");
  const updateStandaloneGains = require("../../utills/agregations/assets/categories/standaloneStats/updateCurrentvalueUnrealizedGainCurrentYearGain");
  const updateConsolidatedValues = require("../../utills/agregations/assets/categories/consolidated/updateConsolidatedValues");
  const {
    getLeafCategoryIds,
    getAllSubCategoryIds,
  } = require("../../utills/agregations/assets/findsAllCategoryIDs");

  const userID = await assetsCatModel
    .findById(this.category_id)
    .select("user")
    .lean();

  await updateBuySellTransaction(this);
  await updateCurrentValuesByFilter({ userId: userID?.user });
  await updateCurrentYearGains({ userId: userID?.user });
  await updateStandaloneGains(await getAllSubCategoryIds(userID?.user));

  const leafcategorys = await getLeafCategoryIds(userID?.user);
  for (const catid of leafcategorys) {
    await updateConsolidatedValues(catid);
  }
  const rootAssetsCategoryId = await assetsCatModel
    .findOne(
      { name: "ASSETS", parentCategory: null, user: userID?.user },
      { _id: 1 }
    )
    .lean();
  await updateConsolidatedValues(rootAssetsCategoryId?._id);
});

module.exports = mongoose.model("assetstransactions", assetsTransactionsSchema);
