const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: { type: String, required: true},
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

module.exports = mongoose.model("categories", categorySchema);
