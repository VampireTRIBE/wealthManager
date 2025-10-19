const express = require("express");
const router = express.Router({ mergeParams: true });

const productDetailControllers = require("../controllers/productDetailControllers");
const {
  isLogedIn,
  checkID,
  checkExists,
  checkOwner,
} = require("../utills/authentication/authentication");
const validation = require("../utills/validation/validation");

// routes

router
  .route("/")
  .post(
    isLogedIn,
    checkID({ type: "user", paramName: "u_id" }),
    checkID({ type: "product", paramName: "p_id" }),
    checkExists({ type: "product", Param: "p_id" }),
    checkOwner({ type: "product", Param1: "p_id", Param2: "u_id" }),
    validation.transactionDATA,
    productDetailControllers.addDetail
  );

router
  .route("/sell")
  .post(
    // isLogedIn,
    checkID({ type: "user", paramName: "u_id" }),
    checkID({ type: "product", paramName: "p_id" }),
    checkExists({ type: "product", Param: "p_id" }),
    checkOwner({ type: "product", Param1: "p_id", Param2: "u_id" }),
    productDetailControllers.sellProduct
  );

module.exports = router;
