const JoiValidation = require("./joiValidation");

const validation = {
  transactionDATA(req, res, next) {
    const { error } = JoiValidation.productDetailsDataValidation.validate(
      req.body
    );
    if (error) {
      return res.status(404).json({
        error: error.details[0].message,
      });
    }
    next();
  },

  productDATA(req, res, next) {
    const { error } = JoiValidation.productDataValidation.validate(req.body);
    if (error) {
      return res.status(404).json({
        error: error.details[0].message,
      });
    }
    next();
  },
  productDATA2(req, res, next) {
    const { error } = JoiValidation.productDataValidation2.validate(req.body);
    if (error) {
      return res.status(404).json({
        error: error.details[0].message,
      });
    }
    next();
  },
  categoryDATA(req, res, next) {
    const { error } = JoiValidation.categoryDataValidation.validate(req.body);
    if (error) {
      return res.status(404).json({
        error: error.details[0].message,
      });
    }
    next();
  },
  statementDATA(req, res, next) {
    const { error } = JoiValidation.statementDataValidation.validate(req.body);
    if (error) {
      return res.status(404).json({
        error: error.details[0].message,
      });
    }
    next();
  },
};

module.exports = validation;
