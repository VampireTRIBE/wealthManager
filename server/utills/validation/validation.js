const JoiValidation = require("./joiValidation");
const custom_error = require("../errors/custom_error");

const validation = {
  registerDATA(req, res, next) {
    const { error } = JoiValidation.userRegistrationDataValidation.validate(
      req.body
    );
    if (error) {
      throw new custom_error(400, error.details[0].message);
    }
    next();
  },

  loginDATA(req, res, next) {
    const { username, password } = req.body;
    if (!username || !password || password.length < 8) {
      throw new custom_error(400, "Username Or Password Not Valid");
    }
    next();
  },
};

module.exports = validation;
