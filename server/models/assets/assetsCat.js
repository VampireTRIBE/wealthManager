const mongoose = require("mongoose");
const { Schema } = mongoose;

const assetsSchema = new Schema(
  {
    name: { type: String, required: true },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "assets",
      default: null,
    },
    description: { type: String },

    standaloneIvestmentValue: { type: Number, default: 0 },
    consolidatedIvestmentValue: { type: Number, default: 0 },

    standaloneCurrentValue: { type: Number, default: 0 },
    consolidatedCurrentValue: { type: Number, default: 0 },

    standaloneRealizedGain: { type: Number, default: 0 },
    consolidatedRealizedGain: { type: Number, default: 0 },

    standaloneUnrealizedGain: { type: Number, default: 0 },
    consolidatedUnRealizedGain: { type: Number, default: 0 },

    standaloneCurrentYearGain: { type: Number, default: 0 },
    consolidatedCurrentYearGain: { type: Number, default: 0 },

    standaloneCash: { type: Number, default: 0 },
    consolidatedCash: { type: Number, default: 0 },

    standaloneIRR: { type: Number, default: 0 },
    consolidatedIRR: { type: Number, default: 0 },

    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
  },
  { timestamps: true }
);

assetsSchema.pre("save", async function (next) {
  if (!this.parentCategory) return next();
  if (this.parentCategory.toString() === this._id?.toString()) {
    return next(new Error("Category cannot be its own parent"));
  }

  try {
    let parent = await this.constructor.findById(this.parentCategory);
    let level = 1;

    while (parent) {
      if (parent._id.toString() === this._id?.toString()) {
        return next(new Error("Circular parent reference detected!"));
      }
      if (!parent.parentCategory) break;

      parent = await this.constructor.findById(parent.parentCategory);
      level++;
      if (level >= 4) break;
    }

    if (level >= 4) {
      return next(
        new Error("Cannot create category: nesting level cannot exceed 4")
      );
    }

    next();
  } catch (err) {
    next(err);
  }
});

// Cascade delete (categories → products → transactions → statements)
assetsSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const Product = require("./assetsProduct");
    const ProductDetails = require("./assetsTransactions");
    const AssetsStatement = require("./assetsStatements");

    try {
      const categoryId = this._id;
      const childCategories = await this.constructor.find({
        parentCategory: categoryId,
      });
      for (const child of childCategories) {
        await child.deleteOne();
      }

      const products = await Product.find({ categories: categoryId });

      for (const product of products) {
        await ProductDetails.deleteMany({ product: product._id });
        await product.deleteOne();
      }
      await AssetsStatement.deleteMany({ category_id: categoryId });
      next();
    } catch (err) {
      next(err);
    }
  }
);

module.exports = mongoose.model("assets", assetsSchema);
