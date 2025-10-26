const user = require("../models/user");
const passport = require("passport");
const dbReq = require("../utills/databaseReq/dbReq");
const assetsCat = require("../models/assets/assetsCat");

const usersControllers = {
  async registerUser(req, res, next) {
    try {
      const { newUser, password } = req.body;
      const new_user = await user.register(new user(newUser), password);

      await assetsCat.create({
        name: "ASSETS",
        description: "Assets Category",
        parentCategory: null,
        user: new_user._id,
      });

      req.login(new_user, async (err) => {
        if (err) return next();

        const u_data = await dbReq.userData(new_user._id);
        if (!u_data) {
          return res.status(404).json({ error: "User data not found" });
        }

        return res.status(200).json({
          success: "Login successful",
          userID: new_user._id,
          Data: u_data,
        });
      });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async loginUser(req, res, next) {
    passport.authenticate("local", (err, user, info) => {
      console.log("request");
      if (err) return next(err);
      if (!user)
        return res.status(400).json({ error: info?.message || "Login failed" });

      req.login(user, async (err) => {
        if (err) return next(err);

        const u_data = await dbReq.userData(user._id);
        if (!u_data) {
          return res.status(404).json({ error: "User data not found" });
        }
        return res.status(200).json({
          success: "Login successful",
          userID: user._id,
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
      res.status(200).json({ success: "LogOut successful" });
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
