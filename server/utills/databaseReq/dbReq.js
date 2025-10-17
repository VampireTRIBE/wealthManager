const mongoose = require("mongoose");
const User = require("../../models/user");
const Category = require("../../models/category");
const Product = require("../../models/product");

// Helper: compute XIRR
function computeXIRR(cashflows) {
  if (cashflows.length < 2) return 0;
  const maxIter = 100, tol = 1e-6, guess = 0.1;
  const baseDate = new Date(cashflows[0].date);
  const days = cashflows.map(cf => (new Date(cf.date) - baseDate) / (1000*60*60*24));
  let rate = guess;

  for (let i = 0; i < maxIter; i++) {
    let f = 0, df = 0;
    for (let j = 0; j < cashflows.length; j++) {
      const t = days[j]/365;
      f += cashflows[j].amount / Math.pow(1+rate, t);
      df += (-t * cashflows[j].amount) / Math.pow(1+rate, t+1);
    }
    const newRate = rate - f/df;
    if (Math.abs(newRate - rate) < tol) return rate*100;
    rate = newRate;
  }
  return rate*100;
}

const dbReq = {
  async userData(userId) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear()-2);

    // 1️⃣ Fetch user
    const user = await User.findById(userId)
      .select("_id firstName lastName email")
      .lean();
    if (!user) return null;

    // 2️⃣ Fetch categories
    const allCategories = await Category.find({ user: userObjectId })
      .select("_id name description parentCategory")
      .lean();

    const findCategory = name =>
      allCategories.find(cat => cat.name.toUpperCase() === name.toUpperCase());

    const incomeCat = findCategory("INCOMES");
    const expenseCat = findCategory("EXPENSES");
    const assetsCat = findCategory("ASSETS");

    // 3️⃣ Fetch products with details
    const allProducts = await Product.aggregate([
      { $match: { user: userObjectId } },
      {
        $lookup: {
          from: "productdetails",
          localField: "_id",
          foreignField: "product",
          as: "details",
        }
      },
      {
        $project: {
          _id:1, name:1, description:1, industry:1, tags:1, buyAVG:1,
          qty:1, realizedGain:1, totalValue:1, categories:1,
          details: { _id:1, quantity:1, buyPrice:1, buyDate:1 }
        }
      }
    ]);

    // 4️⃣ Pre-index products by category ID (fixed)
    const productsByCategory = {};
    allProducts.forEach(prod => {
      // normalize to array
      const catIds = Array.isArray(prod.categories) ? prod.categories : [prod.categories].filter(Boolean);
      catIds.forEach(catId => {
        const id = catId.toString();
        if (!productsByCategory[id]) productsByCategory[id] = [];
        productsByCategory[id].push(prod);
      });
    });

    // 5️⃣ Income & Expense totals
    const sumInPeriod = products =>
      (products || []).reduce((sum,p)=>{
        const tx = p.details.filter(d => new Date(d.buyDate)>=twoYearsAgo);
        return sum + tx.reduce((s,d)=>s+d.quantity*d.buyPrice,0);
      },0);

    const lastTwoYearsIncome = sumInPeriod(productsByCategory[incomeCat?._id.toString()]);
    const lastTwoYearsExpenses = sumInPeriod(productsByCategory[expenseCat?._id.toString()]);

    // 6️⃣ Assets summary
    const assetProducts = productsByCategory[assetsCat?._id.toString()] || [];
    let totalAssetValue=0, totalRealizedGain=0, allCashflows=[];

    assetProducts.forEach(prod=>{
      const prodTotalValue = prod.totalValue || 0;
      const prodRealizedGain = prod.realizedGain || 0;
      totalAssetValue += prodTotalValue;
      totalRealizedGain += prodRealizedGain;

      const flows = prod.details.map(d=>({ date:d.buyDate, amount:-d.quantity*d.buyPrice }));
      if(prodTotalValue>0) flows.push({ date:new Date(), amount:prodTotalValue });
      allCashflows.push(...flows);
    });

    const xirr = computeXIRR(allCashflows);
    const totalUnrealizedGain = totalAssetValue - totalRealizedGain;

    // 7️⃣ Build category tree efficiently using pre-indexed products
    const buildCategoryTree = parentId => {
      const children = allCategories.filter(
        cat => (cat.parentCategory ? cat.parentCategory.toString() : null) === (parentId ? parentId.toString() : null)
      );

      return children.map(cat=>{
        const subCategories = buildCategoryTree(cat._id);
        const catProducts = productsByCategory[cat._id.toString()] || [];
        const allSubProducts = [...catProducts, ...subCategories.flatMap(s=>s.products)];

        const totalValue = allSubProducts.reduce((sum,p)=>sum+(p.totalValue||0),0);

        return {
          _id:cat._id,
          name:cat.name,
          description:cat.description,
          parentCategory:cat.parentCategory,
          totalValue,
          products: allSubProducts.map(p=>({
            _id:p._id, name:p.name, description:p.description, buyAVG:p.buyAVG,
            qty:p.qty, realizedGain:p.realizedGain, totalValue:p.totalValue,
            details:p.details.map(d=>({ _id:d._id, quantity:d.quantity, buyPrice:d.buyPrice, buyDate:d.buyDate }))
          })),
          subCategories
        };
      });
    };

    const categories = buildCategoryTree(null);
    const portfolioTotalValue = categories.reduce((sum,cat)=>sum+cat.totalValue,0);

    const stats = {
      totalCategories: allCategories.length,
      totalProducts: allProducts.length,
      totalProductDetails: allProducts.reduce((sum,p)=>sum+(p.details?.length||0),0)
    };

    // 8️⃣ Return final object
    return {
      user: {
        _id:user._id,
        firstName:user.firstName,
        lastName:user.lastName,
        email:user.email
      },
      categoryIds:{
        incomes:incomeCat?._id||null,
        expenses:expenseCat?._id||null,
        assets:assetsCat?._id||null
      },
      categories,
      portfolioTotalValue,
      stats,
      financialSummary:{
        lastTwoYearsIncome,
        lastTwoYearsExpenses,
        assets:{
          totalValue: totalAssetValue,
          realizedGain: totalRealizedGain,
          unrealizedGain: totalUnrealizedGain,
          xirrPercent: Number(xirr.toFixed(2))
        }
      },
      lastUpdated:new Date()
    };
  }
};

module.exports = dbReq;
