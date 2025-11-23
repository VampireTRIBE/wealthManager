const mongoose = require("mongoose");

async function getAllSubCategoryIds(userId) {
  const AssetsCategory = require("../../../models/assets/assetsCat");
  const result = await AssetsCategory.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        parentCategory: { $ne: null },
      },
    },
    {
      $graphLookup: {
        from: "assets",
        startWith: "$_id",
        connectFromField: "_id",
        connectToField: "parentCategory",
        as: "subcategories",
        restrictSearchWithMatch: { user: new mongoose.Types.ObjectId(userId) },
      },
    },
    {
      $project: {
        _id: 1,
        allCategoryIds: {
          $concatArrays: [["$_id"], "$subcategories._id"],
        },
      },
    },
    {
      $unwind: "$allCategoryIds",
    },
    {
      $group: {
        _id: null,
        allCategoryIds: { $addToSet: "$allCategoryIds" },
      },
    },
  ]);

  return result[0]?.allCategoryIds || [];
}

async function getLeafCategoryIds(userId) {
  const AssetsCategory = require("../../../models/assets/assetsCat");
  const result = await AssetsCategory.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "assets",
        localField: "_id",
        foreignField: "parentCategory",
        as: "children",
      },
    },
    {
      $match: {
        "children.0": { $exists: false },
      },
    },
    {
      $project: { _id: 1 },
    },
  ]);

  return result.map((cat) => cat._id);
}

async function getAllUserIds() {
  try {
    const Users = require("../../../models/user");
    const users = await Users.find({}, "_id");
    return users.map((user) => user._id.toString());
  } catch (error) {
    console.error("Error fetching user IDs:", error);
    return [];
  }
}

module.exports = { getAllSubCategoryIds, getLeafCategoryIds, getAllUserIds };
