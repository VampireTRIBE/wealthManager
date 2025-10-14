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

  productDataValidation: Joi.object({
    newProduct: Joi.object({
      name: Joi.string().required().messages({
        "string.base": "name must be a String.",
        "any.required": "name is required.",
      }),
      description: Joi.string().max(50).messages({
        "string.base": "Discreption must be a String.",
        max: "max Char 50.",
      }),
      industry: Joi.string().max(50).messages({
        "string.base": "Industry must be a String.",
        max: "max Char 50.",
      }),
      tags: Joi.array()
        .items(
          Joi.string().max(20).messages({
            "string.base": "Each tag must be a string.",
            "string.max": "Each tag can have at most 20 characters.",
          })
        )
        .messages({
          "array.base": "Tags must be an array of strings.",
        }),
    }).required(),

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

  productDataValidation2: Joi.object({
    newProduct: Joi.object({
      description: Joi.string().max(50).messages({
        "string.base": "Discreption must be a String.",
        max: "max Char 50.",
      }),
      industry: Joi.string().max(50).messages({
        "string.base": "Industry must be a String.",
        max: "max Char 50.",
      }),
      tags: Joi.array()
        .items(
          Joi.string().max(20).messages({
            "string.base": "Each tag must be a string.",
            "string.max": "Each tag can have at most 20 characters.",
          })
        )
        .messages({
          "array.base": "Tags must be an array of strings.",
        }),
    }).required(),
  }),
};

module.exports = JoiValidation;
