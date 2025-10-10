const user = require("../models/user");
const custom_error = require("../utills/errors/custom_error");
const passport = require("passport");
const dbReq = require("../utills/databaseReq/dbReq");
const Category= require("../models/category")

const usersControllers = {
  async registerUser(req, res, next) {
    try {
      const { newUser, password } = req.body;
      const new_user = await user.register(new user(newUser), password);
      await Category.create({
        name: "INCOMES",
        description: "Income Category",
        user: new_user._id, 
      });
      await Category.create({
        name: "ASSETS",
        description: "Assets Category",
        user: new_user._id, 
      });
      await Category.create({
        name: "EXPENSES",
        description: "Expenses Category",
        user: new_user._id, 
      });
      req.login(new_user, async (err) => {
        if (err) return next();
        const u_data = await dbReq.userData(new_user._id);
        if (!u_data) {
          return res.status(404).json({ error: "User data not found" });
        }
        res.status(200).json({
          message: "Login successful",
          user_id: new_user._id,
          Data: u_data,
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

      req.login(user, async (err) => {
        if (err) return next(err);
        const u_data = await dbReq.userData(user._id);
        if (!u_data) {
          return res.status(404).json({ error: "User data not found" });
        }

        res.status(200).json({
          message: "Login successful",
          user_id: user._id,
          Data: u_data,
        });
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
