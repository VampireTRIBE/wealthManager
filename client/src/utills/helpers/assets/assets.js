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
      const label = key
        .replace(/([A-Z])/g, " $1") // camelCase → words
        .replace(/^./, (str) => str.toUpperCase()); // capitalize first letter

      let value = typeof val === "number" ? val.toFixed(2) : val;
      if (
        key.toLowerCase().includes("percent") ||
        key.toLowerCase().includes("irr")
      ) {
        value = `${value}%`;
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

export const SubAssetData = (
  categories,
  type,
  sc,
  handleEditToggle,
  editCatId,
  navigate
) =>
  categories.map((cat) => {
    const items = objectToLabelValue(cat[type]);
    const rows = [];
    for (let i = 0; i < items.length; i += 2) {
      rows.push(items.slice(i, i + 2));
    }

    return {
      title: cat.Name,
      onMainClick: () => navigate(`/assets/${sc}/${cat.Name}`),
      onEdit: () => handleEditToggle(cat._id),
      rows,
      isEditing: editCatId === cat._id,
      _id: cat._id,
    };
  });

export const SubAssetData2 = (
  categories,
  type,
  sc,
  ssc,
  handleEditToggle,
  editCatId,
  navigate
) =>
  categories.map((cat) => {
    const items = objectToLabelValue(cat[type]);
    const rows = [];
    for (let i = 0; i < items.length; i += 2) {
      rows.push(items.slice(i, i + 2));
    }

    return {
      title: cat.Name,
      onMainClick: () => navigate(`/assets/${sc}/${ssc}/${cat.Name}`),
      onEdit: () => handleEditToggle(cat._id),
      rows,
      isEditing: editCatId === cat._id,
      _id: cat._id,
    };
  });

export function HoldingsData(category) {
  if (!category || !category.products) return [];
  return category.products.map((product) => {
    const pl = product.currentValue - product.investmentValue;
    const plPercent = ((pl / product.investmentValue) * 100).toFixed(2);
    return {
      name: product.name,
      data: {
        LTP:
          product.currentValue && product.qty
            ? (product.currentValue / product.qty).toFixed(2)
            : "0.00",
        Qty: product.qty?.toFixed(2) || "0.00",
        price: product.buyAVG?.toFixed(2) || "0.00",
        invested: product.investmentValue?.toFixed(2) || "0.00",
        current: product.currentValue?.toFixed(2) || "0.00",
        "P/L": pl.toFixed(2),
        "p/l %": `${plPercent}%`,
        "Irr %": `${product.xirrPercent?.toFixed(2) || "0.00"}%`,
        "realized gains": product.realizedGain?.toFixed(2) || "0.00",
      },
      _id: product._id,
    };
  });
}
