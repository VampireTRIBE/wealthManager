const mongoose = require("mongoose");
const {
  updateConsolidatedCash,
} = require("../../utills/agregations/assets/agregations");
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
    const Category = mongoose.model("assets");
    const category = await Category.findById(doc.category_id);

    if (!category) return next(new Error("Category not found"));

    let change = doc.amount;
    if (doc.type === "withdrawal") change = -Math.abs(change);

    category.standaloneCash += change;
    await category.save();

    await updateConsolidatedCash(category._id);

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("assetsstatements", assetsStatementSchema);
