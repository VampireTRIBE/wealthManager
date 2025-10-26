const express = require("express");
const router = express.Router();

const userController = require("../controllers/userControllers");
const validate = require("../utills/validation/user/validation");

// routes

router
  .route("/signup")
  .post(validate.registerDATA, userController.registerUser);

router.route("/islogedin").get(userController.isLogedIn);

router.route("/login").post(validate.loginDATA, userController.loginUser);

router.get("/logout", userController.logoutUser);

module.exports = router;
