const user = require("../models/user");
const custom_error = require("../utills/errors/custom_error");
const passport = require("passport");
const dbReq = require("../utills/databaseReq/dbReq");
const Category = require("../models/category");

const usersControllers = {
  async registerUser(req, res, next) {
    try {
      const { newUser, password } = req.body;
      const new_user = await user.register(new user(newUser), password);

      const categories = [
        { name: "INCOMES", description: "Income Category" },
        { name: "ASSETS", description: "Assets Category" },
        { name: "EXPENSES", description: "Expenses Category" },
      ];
      const wait = (ms) => new Promise((res) => setTimeout(res, ms));
      async function createCategoriesAllSettled(
        categories,
        userId,
        maxRetries = 2
      ) {
        let pending = categories;
        let attempt = 1;

        while (attempt <= maxRetries && pending.length > 0) {
          const results = await Promise.allSettled(
            pending.map((cat) => Category.create({ ...cat, user: userId }))
          );
          const failed = [];
          results.forEach((result, index) => {
            const cat = pending[index];
            if (result.status !== "fulfilled") {
              failed.push(cat);
            }
          });
          pending = failed;
          if (pending.length > 0 && attempt < maxRetries) {
            await wait(1000);
          }
          attempt++;
        }
      }
      await createCategoriesAllSettled(categories, new_user._id, 3);

      req.login(new_user, async (err) => {
        if (err) return next();
        return res.status(200).json({ success: "Login successful" });

        const u_data = await dbReq.userData(new_user._id);
        if (!u_data) {
          return res.status(404).json({ error: "User data not found" });
        }
      });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async loginUser(req, res, next) {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user)
        return res.status(400).json({ error: info?.message || "Login failed" });

      req.login(user, async (err) => {
        if (err) return next(err);
        return res.status(200).json({ success: "Login successful" });

        const u_data = await dbReq.userData(user._id);
        if (!u_data) {
          return res.status(404).json({ error: "User data not found" });
        }
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
