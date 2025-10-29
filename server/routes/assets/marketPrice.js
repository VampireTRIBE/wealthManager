const express = require("express");
const marketPriceControllers = require("../../controllers/assets/marketPrice");
const router = express.Router({ mergeParams: true });

// routes
router.route("/ltp").post(marketPriceControllers.updateLTP);

module.exports = router;
