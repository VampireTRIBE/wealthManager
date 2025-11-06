const express = require("express");
const marketPriceControllers = require("../../controllers/assets/marketPrice");
const {
  isLogedIn,
  checkID,
} = require("../../utills/authentication/assetsAuthentication");
const router = express.Router({ mergeParams: true });

// routes
router
  .route("/")
  .get(
    isLogedIn,
    checkID({ type: "user", paramName: "u_id" }),
    marketPriceControllers.updateLTP
  );

module.exports = router;
