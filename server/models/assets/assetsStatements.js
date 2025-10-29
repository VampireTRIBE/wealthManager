const mongoose = require("mongoose");
const incrementStandaloneInvestmentAndCash = require("../../utills/agregations/assets/categories/standaloneStats/updateInvestmentAndCashValue");
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
    await incrementStandaloneInvestmentAndCash({
      type: doc.type,
      category_id: doc.category_id,
      amount: doc.amount,
    });
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("assetsstatements", assetsStatementSchema);
