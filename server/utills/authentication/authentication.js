const category = require("../../models/category");
const product = require("../../models/product");
const users = require("../../models/user");
const custom_error = require("../errors/custom_error");
const mongoose = require("mongoose");

module.exports.isLogedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized Access" });
};

module.exports.checkID = ({ type, paramName }) => {
  return async (req, res, next) => {
    const Model =
      type === "user" ? users : type === "category" ? category : product;

    const id = req.params[paramName];
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: `: Invalid Request with ID`,
      });
    }
    const exists = await Model.findById(id);
    if (!exists) {
      return res.status(404).json({
        error: `Data not Found with ID`,
      });
    }
    next();
  };
};

module.exports.checkOwner = ({ type, type2 , Param1, Param2 }) => {
  return async (req, res, next) => {
    try {
      const param1Id = req.params[Param1];
      const param2Id = req.params[Param2];

      const Model =
        type === "product" ? product : type === "category" ? category : users;
      const fieldName =
        type2 === "product"
          ? "categories"
          : type === "product"
          ? "user"
          : type === "category"
          ? "user"
          : "";

      const result = await Model.findOne({
        _id: param1Id,
        [fieldName]: param2Id,
      });

      if (!result) {
        return res.status(403).json({
          error: `Access Denied`,
        });
      }
      next();
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
};

module.exports.checkExists = ({ type, Param }) => {
  return async (req, res, next) => {
    try {
      const paramId = req.params[Param];

      const Model =
        type === "product" ? product : type === "category" ? category : users;
      const result = await Model.findById(paramId);
      if (!result) {
        return res.status(404).json({
          error: `Data Not Found`,
        });
      }
      next();
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
};
