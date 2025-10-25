const mongoose = require("mongoose");
const { Schema } = mongoose;
const Product = require("./product"); 
const ProductDetails = require("./productDetail");

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "categories",
      default: null,
    },
    description: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
  },
  { timestamps: true }
);

categorySchema.pre("save", async function (next) {
  if (!this.parentCategory) return next();
  try {
    let parent = await this.constructor.findById(this.parentCategory);
    let level = 1;

    while (parent && parent.parentCategory) {
      level++;
      if (level >= 4) break;
      parent = await this.constructor.findById(parent.parentCategory);
    }

    if (level >= 4) {
      const err = new Error(
        "Cannot create category: nesting level cannot exceed 4"
      );
      return next(err);
    }

    next();
  } catch (err) {
    next(err);
  }
});

categorySchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      const categoryId = this._id;

      // 1️⃣ Delete child categories recursively
      const childCategories = await this.constructor.find({
        parentCategory: categoryId,
      });
      for (const child of childCategories) {
        await child.deleteOne(); // will trigger this middleware recursively
      }

      // 2️⃣ Delete products under this category
      const products = await Product.find({ categories: categoryId });
      for (const product of products) {
        // Delete product details first
        await ProductDetails.deleteMany({ product: product._id });
        // Then delete the product itself
        await product.deleteOne();
      }

      next();
    } catch (err) {
      next(err);
    }
  }
);

module.exports = mongoose.model("categories", categorySchema);
