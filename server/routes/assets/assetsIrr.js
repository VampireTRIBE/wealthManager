const express = require("express");
const router = express.Router({ mergeParams: true });
const IrrControllers = require("../../controllers/assets/assetsIrrControllers");

const {
  isLogedIn,
  checkID,
  checkExists,
  checkOwner,
} = require("../../utills/authentication/assetsAuthentication");

// routes

router.route("/standalone").get(
  isLogedIn,
  checkID({ type: "user", paramName: "u_id" }),
  checkID({ type: "category", paramName: "c_id" }),
  checkExists({ type: "category", Param: "c_id" }),
  checkOwner({ type: "category", Param1: "c_id", Param2: "u_id" }),
  IrrControllers.standalone
);

router.route("/consolidated").get(
  isLogedIn,
  checkID({ type: "user", paramName: "u_id" }),
  checkID({ type: "category", paramName: "c_id" }),
  checkExists({ type: "category", Param: "c_id" }),
  checkOwner({ type: "category", Param1: "c_id", Param2: "u_id" }),
  IrrControllers.consolidated
);

router.route("/p_irr").get(
   isLogedIn,
   checkID({ type: "user", paramName: "u_id" }),
   checkID({ type: "product", paramName: "c_id" }),
   checkExists({ type: "product", Param: "c_id" }),
   checkOwner({ type: "product", Param1: "c_id", Param2: "u_id" }),
   IrrControllers.productirr
);


module.exports = router;
