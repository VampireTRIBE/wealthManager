const express = require("express");
const assetsStatementControllers = require("../../controllers/assets/assetsStatementControllers");
const {
  isLogedIn,
  checkID,
  checkExists,
  checkOwner,
} = require("../../utills/authentication/assetsAuthentication");
const { statementDATA } = require("../../utills/validation/assets/validation");
const router = express.Router({ mergeParams: true });

// routes

router
  .route("/deposit")
  .post(
    isLogedIn,
    checkID({ type: "user", paramName: "u_id" }),
    checkID({ type: "category", paramName: "c_id" }),
    checkExists({ type: "category", Param: "c_id" }),
    checkOwner({ type: "category", Param1: "c_id", Param2: "u_id" }),
    statementDATA,
    assetsStatementControllers.deposit
  );

router
  .route("/withdrawal")
  .post(
    isLogedIn,
    checkID({ type: "user", paramName: "u_id" }),
    checkID({ type: "category", paramName: "c_id" }),
    checkExists({ type: "category", Param: "c_id" }),
    checkOwner({ type: "category", Param1: "c_id", Param2: "u_id" }),
    statementDATA,
    assetsStatementControllers.withdrawal
  );

module.exports = router;
