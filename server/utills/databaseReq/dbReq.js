const mongoose = require("mongoose");
const axios = require("axios");
const User = require("../../models/user");
const Category = require("../../models/category");
const Product = require("../../models/product");

// Helper: fetch live market prices securely
async function fetchLivePrices() {
  try {
    const res = await axios.post(
      process.env.GOOGLE_SCRIPT_URL,
      {
        headers: {
          Authorization: `Bearer ${process.env.GOOGLE_SCRIPT_API_KEY}`,
        },
      },
      { timeout: 10000 }
    );

    if (res.data.error) throw new Error(res.data.error);
    const prices = {};
    for (const row of res.data) prices[row.Symbol] = parseFloat(row.Price);
    return prices;
  } catch (err) {
    console.error("⚠️ Failed to fetch live market prices:", err.message);
    return {};
  }
}

// Helper: compute XIRR
function computeXIRR(cashflows) {
  if (cashflows.length < 2) return 0;
  const maxIter = 100,
    tol = 1e-6,
    guess = 0.1;
  const flows = [...cashflows].sort((a, b) => new Date(a.date) - new Date(b.date));
  const baseDate = new Date(flows[0].date);
  const days = flows.map(cf => (new Date(cf.date) - baseDate) / (1000 * 60 * 60 * 24));
  let rate = guess;
  for (let i = 0; i < maxIter; i++) {
    let f = 0, df = 0;
    for (let j = 0; j < flows.length; j++) {
      const t = days[j] / 365;
      f += flows[j].amount / Math.pow(1 + rate, t);
      df += (-t * flows[j].amount) / Math.pow(1 + rate, t + 1);
    }
    const newRate = rate - f / df;
    if (Math.abs(newRate - rate) < tol) return Number((rate * 100).toFixed(2));
    rate = newRate;
  }
  return Number((rate * 100).toFixed(2));
}

const dbReq = {
  async userData(userId) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);

    // 1️⃣ Fetch User
    const user = await User.findById(userId)
      .select("_id firstName lastName email")
      .lean();
    if (!user) return null;

    // 2️⃣ Fetch Categories
    const allCategories = await Category.find({ user: userObjectId })
      .select("_id name description parentCategory")
      .lean();

    // 3️⃣ Fetch Products + Details
    const allProducts = await Product.aggregate([
      { $match: { user: userObjectId } },
      {
        $lookup: {
          from: "productdetails",
          localField: "_id",
          foreignField: "product",
          as: "details",
        },
      },
    ]);

    // 3.5️⃣ Fetch live market prices (once)
    const livePrices = await fetchLivePrices();

    // 4️⃣ Group products by category
    const productsByCategory = {};
    allProducts.forEach((p) => {
      const catId = p.categories?.toString();
      if (!catId) return;
      if (!productsByCategory[catId]) productsByCategory[catId] = [];
      productsByCategory[catId].push(p);
    });

    // Cache for product stats
    const productStatsMap = new Map();

    // 5️⃣ Compute product stats
    const computeProductStats = (p) => {
      const pid = p._id?.toString();
      if (pid && productStatsMap.has(pid)) return productStatsMap.get(pid);

      const now = new Date();

      const buys = (p.details || [])
        .filter(d => d.type === "buy")
        .sort((a, b) => new Date(a.Date) - new Date(b.Date));
      const sells = (p.details || [])
        .filter(d => d.type === "sell")
        .sort((a, b) => new Date(a.Date) - new Date(b.Date));

      let remainingLots = buys.map(b => ({
        quantity: b.quantity,
        Price: b.Price,
        Date: b.Date,
      }));

      let totalRealized = 0;
      let currentYearRealized = 0;

      sells.forEach(s => {
        let sellQty = s.quantity;
        while (sellQty > 0 && remainingLots.length > 0) {
          const lot = remainingLots[0];
          const lotQty = Math.min(lot.quantity, sellQty);
          const gain = lotQty * (s.Price - lot.Price);

          totalRealized += gain;
          if (new Date(s.Date) >= startOfYear) currentYearRealized += gain;

          lot.quantity -= lotQty;
          sellQty -= lotQty;
          if (lot.quantity === 0) remainingLots.shift();
        }
      });

      const investmentValue = remainingLots.reduce(
        (sum, l) => sum + l.quantity * l.Price,
        0
      );

      const currentHoldingQty = remainingLots.reduce((sum, l) => sum + l.quantity, 0);
      const symbolKey = (p.symbol || p.name || "").toString();
      const livePrice = (livePrices && livePrices[symbolKey]) || p.marketPrice || 0;

      const currentValue =
        currentHoldingQty > 0 && livePrice > 0
          ? currentHoldingQty * livePrice
          : 0;

      const unrealizedGain = currentValue - investmentValue;

      const previousInvestment = remainingLots
        .filter(l => new Date(l.Date) < startOfYear)
        .reduce((sum, l) => sum + l.quantity * l.Price, 0);

      const currentYearLotsInvestment = remainingLots
        .filter(l => new Date(l.Date) >= startOfYear)
        .reduce((sum, l) => sum + l.quantity * l.Price, 0);

      const currentYearUnrealized = currentValue - (previousInvestment + currentYearLotsInvestment);

      const currentYearGain = currentYearRealized + currentYearUnrealized;

      const cashflows = (p.details || []).map(d => ({
        date: d.Date,
        amount: d.type === "buy" ? -d.quantity * d.Price : d.quantity * d.Price,
      }));
      if (currentValue > 0) cashflows.push({ date: now, amount: currentValue });

      const xirrPercent = computeXIRR(cashflows);

      const stats = {
        investmentValue: Number(investmentValue.toFixed(2)),
        currentValue: Number(currentValue.toFixed(2)),
        realizedGain: Number(totalRealized.toFixed(2)),
        unrealizedGain: Number(unrealizedGain.toFixed(2)),
        currentYearGain: Number(currentYearGain.toFixed(2)),
        xirrPercent,
      };

      if (pid) productStatsMap.set(pid, stats);
      return stats;
    };

    // 6️⃣ Recursive category tree
    const buildCategoryTree = (parentId = null, parentTotal = null) => {
      const cats = allCategories.filter(
        (c) =>
          (c.parentCategory ? c.parentCategory.toString() : null) ===
          (parentId ? parentId.toString() : null)
      );

      return cats.map((cat) => {
        const catProducts = productsByCategory[cat._id.toString()] || [];
        const productStats = catProducts.map((p) => computeProductStats(p));
        const subCats = buildCategoryTree(cat._id);

        const subStats = subCats.reduce(
          (acc, s) => {
            acc.investmentValue += s.investmentValue;
            acc.currentValue += s.currentValue;
            acc.realizedGain += s.realizedGain;
            acc.unrealizedGain += s.unrealizedGain;
            acc.currentYearGain += s.currentYearGain;
            return acc;
          },
          { investmentValue: 0, currentValue: 0, realizedGain: 0, unrealizedGain: 0, currentYearGain: 0 }
        );

        const investmentValue =
          Number((productStats.reduce((a, b) => a + b.investmentValue, 0) + subStats.investmentValue).toFixed(2));
        const currentValue =
          Number((productStats.reduce((a, b) => a + b.currentValue, 0) + subStats.currentValue).toFixed(2));
        const realizedGain =
          Number((productStats.reduce((a, b) => a + b.realizedGain, 0) + subStats.realizedGain).toFixed(2));
        const unrealizedGain =
          Number((productStats.reduce((a, b) => a + b.unrealizedGain, 0) + subStats.unrealizedGain).toFixed(2));
        const currentYearGain =
          Number((productStats.reduce((a, b) => a + b.currentYearGain, 0) + subStats.currentYearGain).toFixed(2));

        const allFlows = catProducts.flatMap((p) =>
          (p.details || []).map((d) => ({
            date: d.Date,
            amount: d.type === "buy" ? -d.quantity * d.Price : d.quantity * d.Price,
          }))
        );
        if (currentValue > 0) allFlows.push({ date: new Date(), amount: currentValue });
        const xirrPercent = allFlows.length ? computeXIRR(allFlows) : 0;

        const industryStats = {};
        for (let i = 0; i < catProducts.length; i++) {
          const p = catProducts[i];
          const stats = productStats[i];
          const ind = p.industry || "Unknown";
          if (!industryStats[ind]) industryStats[ind] = { investmentValue: 0, currentValue: 0 };
          industryStats[ind].investmentValue += stats.investmentValue;
          industryStats[ind].currentValue += stats.currentValue;
        }

        const totalValue = currentValue || 1;
        const industryBreakdown = Object.entries(industryStats).map(([industry, val]) => ({
          _id: new mongoose.Types.ObjectId(),
          industry,
          investmentValue: Number(val.investmentValue.toFixed(2)),
          currentValue: Number(val.currentValue.toFixed(2)),
          allocationPercent: Number(((val.currentValue / totalValue) * 100).toFixed(2)),
        }));

        const allocationPercent = parentTotal && parentTotal > 0
          ? Number(((currentValue / parentTotal) * 100).toFixed(2))
          : 100;

        return {
          _id: cat._id,
          name: cat.name,
          description: cat.description,
          investmentValue,
          currentValue,
          realizedGain,
          unrealizedGain,
          currentYearGain,
          xirrPercent,
          allocationPercent,
          industryBreakdown,
          products: catProducts.map((p) => {
            const stats = computeProductStats(p);
            return {
              _id: p._id,
              name: p.name,
              description: p.description,
              industry: p.industry,
              tags: p.tags,
              qty: p.qty,
              buyAVG: p.buyAVG,
              ...stats,
            };
          }),
          subCategories: subCats,
        };
      });
    };

    // 7️⃣ Build top-level categories and totals
    const topCategories = buildCategoryTree(null);

    const totals = topCategories.reduce(
      (acc, cat) => {
        acc.investmentValue += cat.investmentValue;
        acc.currentValue += cat.currentValue;
        acc.realizedGain += cat.realizedGain;
        acc.unrealizedGain += cat.unrealizedGain;
        acc.currentYearGain += cat.currentYearGain;
        return acc;
      },
      { investmentValue: 0, currentValue: 0, realizedGain: 0, unrealizedGain: 0, currentYearGain: 0 }
    );

    const portfolioXirr = computeXIRR(
      allProducts
        .flatMap(p =>
          (p.details || []).map(d => ({ date: d.Date, amount: d.type === "buy" ? -d.quantity * d.Price : d.quantity * d.Price }))
        )
        .concat({ date: new Date(), amount: totals.currentValue })
    );

    const portfolioTotals = {
      _id: new mongoose.Types.ObjectId(),
      investmentValue: Number(totals.investmentValue.toFixed(2)),
      currentValue: Number(totals.currentValue.toFixed(2)),
      realizedGain: Number(totals.realizedGain.toFixed(2)),
      unrealizedGain: Number(totals.unrealizedGain.toFixed(2)),
      currentYearGain: Number(totals.currentYearGain.toFixed(2)),
      xirrPercent: portfolioXirr,
    };

    return {
      _id: user._id,
      user,
      portfolioTotals,
      categories: topCategories,
      lastUpdated: new Date(),
    };
  },
};

module.exports = dbReq;
