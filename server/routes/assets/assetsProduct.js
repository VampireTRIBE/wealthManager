const express = require("express");
const router = express.Router({ mergeParams: true });

const productsControllers = require("../../controllers/assets/assetsProductControllers");
const {
  isLogedIn,
  checkID,
  checkOwner,
  checkExists,
} = require("../../utills/authentication/assetsAuthentication");
const {
  productDATA,
  productDATA2,
} = require("../../utills/validation/assets/validation");

// routes

router
  .route("/")
  .post(
    isLogedIn,
    checkID({ type: "user", paramName: "u_id" }),
    checkID({ type: "category", paramName: "c_id" }),
    checkExists({ type: "category", Param: "c_id" }),
    checkOwner({ type: "category", Param1: "c_id", Param2: "u_id" }),
    productDATA,
    productsControllers.addNewProduct
  );

router.route("/:p_id").patch(
  isLogedIn,
  checkID({ type: "user", paramName: "u_id" }),
  checkID({ type: "category", paramName: "c_id" }),
  checkID({ type: "product", paramName: "p_id" }),
  checkExists({ type: "category", Param: "c_id" }),
  checkExists({ type: "product", Param: "p_id" }),
  checkOwner({ type: "category", Param1: "c_id", Param2: "u_id" }),
  checkOwner({
    type: "product",
    type2: "product",
    Param1: "p_id",
    Param2: "c_id",
  }),
  productDATA2,
  productsControllers.editProduct
);

module.exports = router;
