export const objectToLabelValue = (obj) =>
  Object.entries(obj)
    .filter(
      ([key, val]) =>
        key !== "_id" &&
        typeof val !== "object" &&
        key !== "name" &&
        key !== "description"
    )
    .map(([key, val]) => {
      let label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());

      let value = typeof val === "number" ? val.toFixed(2) : val;
      if (
        key.toLowerCase().includes("percent") ||
        key.toLowerCase().includes("irr")
      ) {
        label = "IRR %";
        value = `${value ? value : 0.00} %`;
      }
      return { label, value };
    });

export const AssetsData = (category, type) => ({
  title: category.Name,
  content: objectToLabelValue(category[type]),
});

export const S2DiscriptionData = (category, type) => {
  const stats = category[type];
  const items = objectToLabelValue(stats);
  const rows = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }
  return { rows };
};

export function HoldingsData(category) {
  if (!category || !category.products) return [];

  const formatINR = (num) => {
    if (isNaN(num)) return "0.00 Rs";
    return `${Number(num).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} Rs`;
  };

  return category.products.map((product) => {
    const pl = product.currentValue - product.totalValue;
    const plPercent = (
      (pl / (product.currentValue + product.totalValue)) *
      100
    ).toFixed(2);

    return {
      name: product.name,
      data: {
        LTP: product.LTP.toFixed(2),
        Qty: product.qty.toFixed(2),
        Avg: product.buyAVG.toFixed(2),
        Invested: formatINR(product.totalValue),
        Current: formatINR(product.currentValue),
        "P/L": formatINR(pl),
        "P/L%": `${plPercent}%`,
        "Realized Gains": formatINR(product.realizedGain),
        "Unrealized Gains": formatINR(product.unRealizedGain),
        "Current Year Gains": formatINR(product.currentYearGain),
      },
      _id: product._id,
    };
  });
}
