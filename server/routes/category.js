const express = require("express");
const router = express.Router({ mergeParams: true });

const categoryController = require("../controllers/categoryControllers");
const validate = require("../utills/validation/validation");
const {
  checkID,
  isLogedIn,
  checkExists,
  checkOwner,
} = require("../utills/authentication/authentication");
isLogedIn;

// routes

router
  .route("/:pc_id")
  .post(
    isLogedIn,
    checkID({ type: "user", paramName: "u_id" }),
    checkID({ type: "category", paramName: "pc_id" }),
    checkExists({ type: "category", Param: "pc_id" }),
    checkOwner({ type: "category", Param1: "pc_id", Param2: "u_id" }),
    validate.categoryDATA,
    categoryController.addCategory
  );

router
  .route("/:c_id/edit")
  .patch(
    isLogedIn,
    checkID({ type: "user", paramName: "u_id" }),
    checkID({ type: "category", paramName: "c_id" }),
    checkExists({ type: "category", Param: "c_id" }),
    checkOwner({ type: "category", Param1: "c_id", Param2: "u_id" }),
    validate.categoryDATA,
    categoryController.editCategory
  );

router
  .route("/:c_id/delete")
  .delete(
    isLogedIn,
    checkID({ type: "user", paramName: "u_id" }),
    checkID({ type: "category", paramName: "c_id" }),
    checkExists({ type: "category", Param: "c_id" }),
    checkOwner({ type: "category", Param1: "c_id", Param2: "u_id" }),
    categoryController.delCategory
  );

module.exports = router;
