const mongoose = require("mongoose");
const User = require("../../models/user");
const Product = require("../../models/product");
const ProductDetails = require("../../models/productDetail");
const Category = require("../../models/category");

const dbReq = {
  async userData(userId) {
    // 1️⃣ Get user info
    const userData = await User.findById(userId)
      .select("firstName lastName email")
      .lean();
    if (!userData) return null;

    // 2️⃣ Aggregate all categories with products and totalValue
    let allCategories = await Category.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },

      // Lookup products for each category
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "categories",
          as: "products",
          pipeline: [
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            {
              $lookup: {
                from: "productdetails",
                localField: "_id",
                foreignField: "product",
                as: "details",
                pipeline: [
                  { $project: { quantity: 1, buyPrice: 1, buyDate: 1 } },
                  { $sort: { buyDate: 1 } }
                ]
              }
            },
            // totalValue per product
            {
              $addFields: {
                totalValue: {
                  $sum: {
                    $map: {
                      input: "$details",
                      as: "d",
                      in: { $multiply: ["$$d.quantity", "$$d.buyPrice"] }
                    }
                  }
                }
              }
            },
            {
              $project: {
                name: 1,
                industry: 1,
                description: 1,
                buyAVG: 1,
                qty: 1,
                details: 1,
                totalValue: 1
              }
            },
            { $sort: { name: 1 } }
          ]
        }
      },

      // Lookup parentCategory
      {
        $lookup: {
          from: "categories",
          localField: "parentCategory",
          foreignField: "_id",
          as: "parent",
        }
      },
      { $addFields: { parentCategory: { $arrayElemAt: ["$parent", 0] } } },

      // Compute totalValue per category (products only for now)
      { $addFields: { totalValue: { $sum: "$products.totalValue" } } },

      { $project: { name: 1, description: 1, parentCategory: 1, products: 1, totalValue: 1 } },
      { $sort: { name: 1 } }
    ]);

    // 3️⃣ Separate top-level categories and subcategories
    const categoriesWithoutParent = allCategories.filter((cat) => !cat.parentCategory);
    const categoriesWithParent = allCategories.filter((cat) => cat.parentCategory);

    // 4️⃣ Link subcategories and calculate combined totalValue for top-level categories
    const categories = categoriesWithoutParent.map((cat) => {
      const subCategories = categoriesWithParent.filter(
        (sub) => sub.parentCategory._id.toString() === cat._id.toString()
      );

      // Add subcategories' totalValue to top-level category totalValue
      const combinedTotalValue =
        cat.totalValue + subCategories.reduce((sum, sub) => sum + sub.totalValue, 0);

      return {
        ...cat,
        subCategories,
        totalValue: combinedTotalValue
      };
    });

    // 5️⃣ Compute overall portfolio totalValue
    const portfolioTotalValue = categories.reduce((sum, cat) => sum + cat.totalValue, 0);

    return {
      user: userData,
      categories,
      portfolioTotalValue
    };
  },
};

module.exports = dbReq;
