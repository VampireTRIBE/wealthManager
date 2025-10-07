const express = require("express");
const router = express.Router();
const passport = require("passport");

const userController = require("../controllers/userControllers");

// routes

router
  .route("/signup")
  .get(userController.showRegisterForm)
  .post(userController.registerUser);

router
  .route("/login")
  .get(userController.showLoginForm)
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.loginUser
  );

router.get("/logout", userController.logoutUser);

module.exports = router;
