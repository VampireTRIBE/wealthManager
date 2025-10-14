const Joi = require("joi");

const JoiValidation = {
  userRegistrationDataValidation: Joi.object({
    newUser: Joi.object({
      firstName: Joi.string().max(15).required().messages({
        "string.base": "First name must be a string",
        "string.empty": "First name is required",
        "string.max": "First name cannot exceed 15 characters",
      }),
      lastName: Joi.string().max(15).required().messages({
        "string.empty": "Last name is required",
        "string.max": "Last name cannot exceed 15 characters",
      }),
      email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Email must be a valid email address",
      }),
      username: Joi.string().alphanum().min(3).max(30).required().messages({
        "string.empty": "Username is required",
        "string.alphanum": "Username must only contain letters and numbers",
        "string.min": "Username must be at least 3 characters",
        "string.max": "Username cannot exceed 30 characters",
      }),
    }).required(),

    password: Joi.string().min(8).max(128).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password cannot exceed 128 characters",
    }),
  }),

  productDetailsDataValidation: Joi.object({
    transaction: Joi.object({
      quantity: Joi.number().required().messages({
        "number.base": "Quantity must be a number.",
        "any.required": "Quantity is required.",
      }),
      buyPrice: Joi.number().min(0.00001).required().messages({
        "number.base": "Buy price must be a number.",
        "number.min": "Buy price cannot be Zero.",
        "any.required": "Buy price is required.",
      }),
      buyDate: Joi.date()
        .default(() => new Date())
        .messages({
          "date.base": "Invalid date format for buyDate.",
        }),
    }).required(),
  }),
};

module.exports = JoiValidation;

