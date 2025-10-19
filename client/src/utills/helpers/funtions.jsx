import { useState, useEffect } from "react";
import api from "../../servises/apis/apis";

export const formatDateTime = (date = new Date()) => {
  const d = new Date(date);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${mm}/${dd}/${yyyy} ${hh}:${min}:${ss}`;
};

export const useLiveDateTime = () => {
  const [currentDate, setCurrentDate] = useState(formatDateTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(formatDateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return currentDate;
};

export const logoutUser = async (setUserData, navigate) => {
  try {
    await api.get("/logout");
    setUserData(null);
    navigate("/");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

export const topCategoryBtns = ({
  userData,
  u_id,
  navigate,
  handleLogout,
  buttonStyle,
}) => {
  if (!userData?.categories) return [];
  return [
    ...userData.categories.map((cat, i) => ({
      text: cat.name.toUpperCase(),
      className: buttonStyle,
      dis: i,
      onClick: () => navigate(`/home/${u_id}/${cat._id}`),
    })),
    {
      text: "LogOut",
      className: buttonStyle,
      onClick: handleLogout,
      dis: userData.categories.length,
    },
  ];
};

export const subCategoryBtns = ({ category, u_id, navigate, buttonStyle }) => {
  if (!category?.subCategories) return [];

  const buttons = category.subCategories.map((subCat) => ({
    text: subCat.name.toUpperCase(),
    className: buttonStyle,
    onClick: () => navigate(`/home/${u_id}/${category._id}/${subCat._id}`),
  }));
  return buttons;
};

// utils/assetHelpers.js

/**
 * Convert any object to label/value array (ignores _id and nested objects)
 * Automatically formats numbers to 2 decimals
 */
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

export const buildAssetsDataFromCategory = (
  category,
  currentDate = new Date()
) => ({
  title: category.name,
  date: currentDate,
  content: objectToLabelValue(category),
});

/**
 * Build subcategory assets for AssetsSection2
 */
export const buildAssetSectionsFromCategories = (
  categories,
  u_id,
  dc_id,
  handleDelete,
  handleEditToggle,
  editCatId,
  navigate
) =>
  categories.map((cat) => {
    const items = objectToLabelValue(cat);
    const rows = [];
    for (let i = 0; i < items.length; i += 2) {
      rows.push(items.slice(i, i + 2));
    }

    return {
      title: cat.name,
      onMainClick: () => navigate(`/home/${u_id}/${dc_id}/${cat._id}`),
      onEdit: () => handleEditToggle(cat._id),
      onDelete: () => handleDelete(cat._id),
      rows,
      isEditing: editCatId === cat._id,
      _id: cat._id,
    };
  });

export const buildSubAssetSectionsFromCategories = (
  categories,
  u_id,
  dc_id,
  sc_id,
  handleDelete,
  handleEditToggle,
  editCatId,
  navigate
) =>
  categories.map((cat) => {
    const items = objectToLabelValue(cat);
    const rows = [];
    for (let i = 0; i < items.length; i += 2) {
      rows.push(items.slice(i, i + 2));
    }

    return {
      title: cat.name,
      onMainClick: () => navigate(`/home/${u_id}/${dc_id}/${sc_id}/${cat._id}`),
      onEdit: () => handleEditToggle(cat._id),
      onDelete: () => handleDelete(cat._id),
      rows,
      isEditing: editCatId === cat._id,
      _id: cat._id,
    };
  });

export const buildSubAsset2SectionsFromCategories = (
  categories,
  u_id,
  dc_id,
  sc_id,
  ssc_id,
  handleDelete,
  handleEditToggle,
  editCatId,
  navigate
) =>
  categories.map((cat) => {
    const items = objectToLabelValue(cat);
    const rows = [];
    for (let i = 0; i < items.length; i += 2) {
      rows.push(items.slice(i, i + 2));
    }

    return {
      title: cat.name,
      onMainClick: () => navigate(`/home/${u_id}/${dc_id}/${sc_id}/${ssc_id}/${cat._id}`),
      onEdit: () => handleEditToggle(cat._id),
      onDelete: () => handleDelete(cat._id),
      rows,
      isEditing: editCatId === cat._id,
      _id: cat._id,
    };
  });

export const buildSubAsset3SectionsFromCategories = (
  categories,
  u_id,
  dc_id,
  sc_id,
  ssc_id,
  sssc_id,
  handleDelete,
  handleEditToggle,
  editCatId,
  navigate
) =>
  categories.map((cat) => {
    const items = objectToLabelValue(cat);
    const rows = [];
    for (let i = 0; i < items.length; i += 2) {
      rows.push(items.slice(i, i + 2));
    }

    return {
      title: cat.name,
      onMainClick: () => navigate(`/home/${u_id}/${dc_id}/${sc_id}/${ssc_id}/${sssc_id}/${cat._id}`),
      onEdit: () => handleEditToggle(cat._id),
      onDelete: () => handleDelete(cat._id),
      rows,
      isEditing: editCatId === cat._id,
      _id: cat._id,
    };
  });
