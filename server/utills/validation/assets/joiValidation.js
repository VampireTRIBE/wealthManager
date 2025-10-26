const Joi = require("joi");

const JoiValidation = {
  productDetailsDataValidation: Joi.object({
    transaction: Joi.object({
      quantity: Joi.number().required().messages({
        "number.base": "Quantity must be a number.",
        "any.required": "Quantity is required.",
      }),
      Price: Joi.number().min(0.00001).required().messages({
        "number.base": "Buy price must be a number.",
        "number.min": "Buy price cannot be Zero.",
        "any.required": "Buy price is required.",
      }),
      Date: Joi.date()
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
      Price: Joi.number().min(0.00001).required().messages({
        "number.base": "Buy price must be a number.",
        "number.min": "Buy price cannot be Zero.",
        "any.required": "Buy price is required.",
      }),
      Date: Joi.date()
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

  categoryDataValidation: Joi.object({
    newCategory: Joi.object({
      name: Joi.string().required().messages({
        "string.base": "name must be a String.",
        "any.required": "name is required.",
      }),
      description: Joi.string().max(50).messages({
        "string.base": "Discreption must be a String.",
        max: "max Char 50.",
      }),
    }).required(),
  }),

  statementDataValidation: Joi.object({
    statement: Joi.object({
      categoryName: Joi.string()
        .required()
        .messages({
          "string.base": "categoryName must be a String.",
          "any.required": "categoryName is required.",
        })
        .required(),
      amount: Joi.number().min(0.00001).required().messages({
        "number.base": "amount must be a number.",
        "number.min": "amount cannot be Zero.",
        "any.required": "amount is required.",
      }),
      date: Joi.date()
        .default(() => new Date())
        .messages({
          "date.base": "Invalid date format for buyDate.",
        }),
    }).required(),
  }),
};

module.exports = JoiValidation;
