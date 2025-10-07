const user = require("../models/user");

const usersControllers = {
  showRegisterForm(req, res) {
    res.send("Registeration Form");
  },

  async registerUser(req, res, next) {
    try {
      const { newUser, password } = req.body;
      const new_user = await user.register(new user(newUser), password);
      req.login(new_user, (err) => {
        if (err) {
          return next();
        }
        req.flash("success", "Welecome To Wealth Manager.....");
        res.send(`Registeration sccess`);
      });
    } catch (error) {
      req.flash("error", error.message);
      return res.send(`Error in registeration`);
    }
  },

  showLoginForm(req, res) {
    res.send("login from");
  },

  async loginUser(req, res) {
    req.flash("success", "Welcome back to Wealth Manager....");
    // res.locals.redirectUrl = res.locals.redirectUrl || `/listings`;
    res.send("login Sccesss");
  },

  async logoutUser(req, res, next) {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "You logout Successfuly.....");
      res.send("logout Sccesss");
    });
  },
};

module.exports = usersControllers;
