
const mongoose = require("mongoose");
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

    // ✅ Update standalone Cash
    let change = doc.amount;
    if (doc.type === "withdrawal") change = -Math.abs(change);

    category.standaloneCash += change;
    await category.save();

    // ✅ Update Consolidated Cash of entire tree
    async function updateConsolidated(catId) {
      const current = await Category.findById(catId);
      if (!current) return;

      // Find all subcategories
      const subs = await Category.find({ parentCategory: catId });

      let total = current.standaloneCash;
      for (const sub of subs) {
        await updateConsolidated(sub._id); // recursive update
        const freshSub = await Category.findById(sub._id);
        total += freshSub.consolidatedCash;
      }

      current.consolidatedCash = total;
      await current.save();
    }

    // Recalculate from root
    let start = category;
    while (start.parentCategory) {
      start = await Category.findById(start.parentCategory);
    }
    await updateConsolidated(start._id);

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("assetsstatements", assetsStatementSchema);
