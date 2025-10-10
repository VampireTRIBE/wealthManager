const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    value: { type: Number, min: 0, default: 0 },
    subcategories: [],
  },
  { timestamps: false }
);

categorySchema.add({ subcategories: [categorySchema] });

// Root wealth schema
const wealthSchema = new Schema(
  {
    categories: [categorySchema],
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// function sumCategories(categories = []) {
//   return categories.reduce((sum, cat) => {
//     const own = cat.value || 0;
//     const children = sumCategories(cat.subcategories || []);
//     return sum + own + children;
//   }, 0);
// }
// wealthSchema.virtual("totalValue").get(function () {
//   return sumCategories(this.categories || []);
// });

const wealth = mongoose.model("wealth", wealthSchema);
module.exports = wealth;