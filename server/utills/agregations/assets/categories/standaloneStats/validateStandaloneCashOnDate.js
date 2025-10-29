const mongoose = require("mongoose");

/**
 * @param {Object} params
 * @param {String|mongoose.Types.ObjectId} params.category_id - Category ID
 * @param {String|Date} params.date - The date to validate against
 * @returns {Number} availableCash
 */
async function validateStandaloneCashOnDate({ category_id, date }) {
  const Statements = require("../../../../../models/assets/assetsStatements");
  const Transactions = require("../../../../../models/assets/assetsTransactions");

  const catId = new mongoose.Types.ObjectId(category_id);
  const buyDate = new Date(date);
l
  const dayStart = new Date(buyDate);
  dayStart.setHours(0, 0, 0, 0);
  const nextDay = new Date(dayStart);
  nextDay.setDate(dayStart.getDate() + 1);

  const [result] = await Statements.aggregate([
    { $match: { category_id: catId } },

    {
      $project: {
        _id: 0,
        date: { $dateTrunc: { date: "$date", unit: "day" } },
        amount: {
          $cond: [
            { $eq: ["$type", "deposit"] },
            "$amount",
            { $multiply: ["$amount", -1] },
          ],
        },
      },
    },

    {
      $unionWith: {
        coll: "assetstransactions",
        pipeline: [
          { $match: { category_id: catId } },
          {
            $project: {
              _id: 0,
              date: { $dateTrunc: { date: "$Date", unit: "day" } },
              amount: {
                $switch: {
                  branches: [
                    {
                      case: { $eq: ["$type", "buy"] },
                      then: { $multiply: ["$Price", "$quantity", -1] },
                    },
                    {
                      case: { $eq: ["$type", "sell"] },
                      then: { $multiply: ["$Price", "$quantity"] },
                    },
                  ],
                  default: 0,
                },
              },
            },
          },
        ],
      },
    },
    { $match: { date: { $lt: nextDay } } },
    { $sort: { date: 1 } },
    {
      $setWindowFields: {
        sortBy: { date: 1 },
        output: {
          runningCash: {
            $sum: "$amount",
            window: { documents: ["unbounded", "current"] },
          },
        },
      },
    },

    { $sort: { date: -1 } },
    { $limit: 1 },
  ]);

  const availableCash = result?.runningCash ?? 0;
  return availableCash;
}

module.exports = validateStandaloneCashOnDate;
