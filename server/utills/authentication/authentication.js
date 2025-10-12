const custom_error = require("../errors/custom_error");

module.exports.isLogedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  throw new custom_error("400" ,"Not Logedin");
};

