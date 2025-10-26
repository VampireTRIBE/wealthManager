const express = require("express");
const router = express.Router({ mergeParams: true });

const assetsTransactionControllers = require("../../controllers/assets/assetsTransactionControllers");
const {
  isLogedIn,
  checkID,
  checkExists,
  checkOwner,
} = require("../../utills/authentication/assetsAuthentication");
const validation = require("../../utills/validation/assets/validation");

// routes

router.route("/").post(
  isLogedIn,
  checkID({ type: "user", paramName: "u_id" }),
  checkID({ type: "product", paramName: "p_id" }),
  checkExists({ type: "product", Param: "p_id" }),
  checkOwner({ type: "product", Param1: "p_id", Param2: "u_id" }),
  validation.transactionDATA,
  assetsTransactionControllers.addDetail
);

router.route("/sell").post(
  isLogedIn,
  checkID({ type: "user", paramName: "u_id" }),
  checkID({ type: "product", paramName: "p_id" }),
  checkExists({ type: "product", Param: "p_id" }),
  checkOwner({ type: "product", Param1: "p_id", Param2: "u_id" }),
  assetsTransactionControllers.sellProduct
);

module.exports = router;
