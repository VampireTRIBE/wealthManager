const express = require("express");
const router = express.Router({ mergeParams: true });

const assetsCategoryControllers = require("../../controllers/assets/assetCatControllers");
const validate = require("../../utills/validation/assets/validation");
const {
  checkID,
  isLogedIn,
  checkExists,
  checkOwner,
} = require("../../utills/authentication/assetsAuthentication");
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
    assetsCategoryControllers.addCategory
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
    assetsCategoryControllers.editCategory
  );

router
  .route("/:c_id/delete")
  .delete(
    isLogedIn,
    checkID({ type: "user", paramName: "u_id" }),
    checkID({ type: "category", paramName: "c_id" }),
    checkExists({ type: "category", Param: "c_id" }),
    checkOwner({ type: "category", Param1: "c_id", Param2: "u_id" }),
    assetsCategoryControllers.delCategory
  );

module.exports = router;
