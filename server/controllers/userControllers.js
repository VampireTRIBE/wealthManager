const user = require("../models/user");
const custom_error = require("../utills/errors/custom_error");
const passport = require("passport");

const usersControllers = {
  async registerUser(req, res, next) {
    try {
      const { newUser, password } = req.body;
      const new_user = await user.register(new user(newUser), password);
      req.login(new_user, (err) => {
        if (err) {
          return next();
        }
        req.flash("success", "Welecome To Wealth Manager.....");
        res.status(200).json({
          message: "Welecome To Wealth Manager.....",
          user_id: new_user._id,
        });
      });
    } catch (error) {
      req.flash("error", error.message);
      throw new custom_error(400, error.message);
    }
  },

  async loginUser(req, res, next) {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user)
        return res.status(400).json({ error: info?.message || "Login failed" });

      req.login(user, (err) => {
        if (err) return next(err);
        res
          .status(200)
          .json({ message: "Login successful", user_id: user._id });
      });
    })(req, res, next);
  },

  async logoutUser(req, res, next) {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({ message: "LogOut successful" });
    });
  },

  async isLogedIn(req, res, next) {
    if (req.isAuthenticated()) {
      res.json({ authenticated: true, user_id: req.user._id });
    } else {
      res.json({ authenticated: false });
    }
  },
};

module.exports = usersControllers;
