const mongoose = require("mongoose");
require("../../../models/assets/marketPrice");
require("../../../models/assets/assetsProduct");
require("../../../models/assets/assetsTransactions");

const Product = mongoose.model("assetsproducts");
const Transactions = mongoose.model("assetstransactions");
const MarketPrice = mongoose.model("marketprices");

async function getUserProductIds(userId) {
  const products = await Product.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    { $project: { _id: 1 } },
  ]);

  return products.map((p) => p._id);
}

async function updateProductValuations(productIds) {
  const currentYearStart = new Date(new Date().getFullYear(), 0, 1);

  const products = await Product.find({ _id: { $in: productIds } }).lean();
  if (!products.length) return;

  const marketData = await MarketPrice.find({
    symbol: { $in: products.map((p) => p.name) },
  }).lean();

  const marketMap = {};
  marketData.forEach((m) => {
    marketMap[m.symbol] = {
      LTP: m.LTP,
      CYSLTP: m.CYSLTP ?? m.LTP,
    };
  });

  // ✅ Calculate realized gains from SELL transactions in current year
  const realizedAgg = await Transactions.aggregate([
    {
      $match: {
        product: { $in: productIds },
        type: "sell",
        Date: { $gte: currentYearStart },
      },
    },
    {
      $lookup: {
        from: "assetsproducts",
        localField: "product",
        foreignField: "_id",
        as: "prod",
      },
    },
    { $unwind: "$prod" },
    {
      $group: {
        _id: "$product",
        gain: {
          $sum: {
            $multiply: [{ $subtract: ["$Price", "$prod.buyAVG"] }, "$quantity"],
          },
        },
      },
    },
  ]);

  const realizedMap = Object.fromEntries(
    realizedAgg.map((r) => [String(r._id), r.gain])
  );

  const operations = [];

  for (const product of products) {
    const { LTP, CYSLTP } = marketMap[product.name] || {
      LTP: product.buyAVG,
      CYSLTP: product.buyAVG,
    };

    const grossCurrentValue = product.qty * LTP;
    const unrealizedGain = grossCurrentValue - product.buyAVG * product.qty;

    let prevUnrealizedGain = (CYSLTP - product.buyAVG) * product.qty;

    // ✅ no previous unrealized gains if bought in current year
    if (new Date(product.dateADDED) > currentYearStart) {
      prevUnrealizedGain = 0;
    }

    const currentYearUnrealizedGain = Math.max(
      unrealizedGain - prevUnrealizedGain,
      0
    );

    const currentYearRealizedGain = realizedMap[String(product._id)] || 0;

    const currentYearGain = currentYearRealizedGain + currentYearUnrealizedGain;

    const currentValue =
      product.totalValue + product.realizedGain + unrealizedGain;

    operations.push({
      updateOne: {
        filter: { _id: product._id },
        update: {
          $set: {
            currentValue,
            unRealizedGain: unrealizedGain,
            currentYearGain,
          },
        },
      },
    });
  }

  if (operations.length) {
    await Product.bulkWrite(operations);
    console.log(
      `✅ Updated ${operations.length} products valuations successfully!`
    );
  }
}

module.exports = { updateProductValuations, getUserProductIds };
