const mongoose = require("mongoose");
const incrementStandaloneInvestmentAndCash = require("../../utills/agregations/assets/categories/standaloneStats/updateInvestmentAndCashValue");
const recordCategoryCurves = require("../../utills/agregations/assets/categoryCarve/updateCurveValues");
const Schema = mongoose.Schema;

const assetsStatementSchema = new Schema(
  {
    type: { type: String, required: true },
    categoryName: { type: String, required: true },
    category_id: { type: Schema.Types.ObjectId, ref: "assets", required: true },
    amount: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
  },
  { timestamps: true }
);

assetsStatementSchema.post("save", async function (doc, next) {
  try {
    const assetsCatModel = require("../../models/assets/assetsCat");
    const updateConsolidatedValues = require("../../utills/agregations/assets/categories/consolidated/updateConsolidatedValues");
    const {
      getLeafCategoryIds,
      getAllSubCategoryIds,
    } = require("../../utills/agregations/assets/findsAllCategoryIDs");

    await incrementStandaloneInvestmentAndCash({
      type: doc.type,
      category_id: doc.category_id,
      amount: doc.amount,
    });

    const userID = await assetsCatModel
      .findById(doc.category_id)
      .select("user")
      .lean();
    const leafcategorys = await getLeafCategoryIds(userID?.user);
    for (const catid of leafcategorys) {
      await updateConsolidatedValues(catid);
    }
    const rootAssetsCategoryId = await assetsCatModel
      .findOne({ name: "ASSETS", parentCategory: null }, { _id: 1 })
      .lean();
    await updateConsolidatedValues(rootAssetsCategoryId?._id);
    const assetsSubCategoriesIDs = await getAllSubCategoryIds(userID?.user);
    const today = new Date(doc.date);
    today.setHours(0, 0, 0, 0);
    console.log(today);
    assetsSubCategoriesIDs.push(rootAssetsCategoryId?._id);
    await recordCategoryCurves(assetsSubCategoriesIDs, today);

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("assetsstatements", assetsStatementSchema);
