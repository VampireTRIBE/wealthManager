const mongoose = require("mongoose");
const User = require("../../models/user");
const Category = require("../../models/category");
const Product = require("../../models/product");

const dbReq = {
  async userData(userId) {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // 1️⃣ Get user info
    const userData = await User.findById(userId)
      .select("firstName lastName email")
      .lean();
    if (!userData) return null;

    // 2️⃣ Get all categories of user
    const allCategories = await Category.find({ user: userObjectId }).lean();

    // 3️⃣ Get all products with details
    const allProducts = await Product.aggregate([
      { $match: { user: userObjectId } },
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
      }
    ]);

    // 4️⃣ Map products to categories
    const categoryProductMap = {};
    allCategories.forEach(cat => {
      categoryProductMap[cat._id.toString()] = [];
    });
    allProducts.forEach(prod => {
      prod.categories.forEach(catId => {
        const idStr = catId.toString();
        if (categoryProductMap[idStr]) {
          categoryProductMap[idStr].push(prod);
        }
      });
    });

    // 5️⃣ Recursive function to build category tree including inherited products
    function buildCategoryTree(parentId) {
      const children = allCategories.filter(
        cat =>
          (cat.parentCategory ? cat.parentCategory.toString() : null) ===
          (parentId ? parentId.toString() : null)
      );

      return children.map(cat => {
        const subCategories = buildCategoryTree(cat._id);

        // Merge all products from this category and its subcategories
        const allSubProducts = [
          ...(categoryProductMap[cat._id.toString()] || []),
          ...subCategories.flatMap(sub => sub.products)
        ];

        // Sort products by totalValue descending
        allSubProducts.sort((a, b) => b.totalValue - a.totalValue);

        // Compute total value
        const totalValue = allSubProducts.reduce(
          (sum, p) => sum + (p.totalValue || 0),
          0
        );

        return {
          ...cat,
          products: allSubProducts,
          totalValue,
          subCategories
        };
      });
    }

    // 6️⃣ Build the tree starting with top-level categories
    const categories = buildCategoryTree(null);

    // 7️⃣ Compute overall portfolio value
    const portfolioTotalValue = categories.reduce(
      (sum, cat) => sum + cat.totalValue,
      0
    );

    // 8️⃣ Compute summary statistics
    const stats = {
      totalCategories: allCategories.length,
      totalProducts: allProducts.length,
      totalProductDetails: allProducts.reduce(
        (sum, p) => sum + (p.details?.length || 0),
        0
      ),
    };

    // 9️⃣ Return the structured response
    return {
      user: userData,
      categories,
      portfolioTotalValue,
      stats,
      lastUpdated: new Date(),
    };
  }
};

module.exports = dbReq;
