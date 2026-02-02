const Joi = require("joi");

/**
 * Factory function to create validation middleware
 * @param {Joi.Schema} schema - Joi validation schema
 * @param {string} property - Request property to validate ('body', 'query', 'params')
 */
const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message.replace(/"/g, ""),
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    // Replace request property with validated value
    req[property] = value;
    next();
  };
};

// Validation Schemas
const schemas = {
  // Auth schemas
  register: Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
      "string.min": "Username must be at least 3 characters",
      "string.max": "Username cannot exceed 30 characters",
      "any.required": "Username is required",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required",
    }),
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string().required().messages({
      "any.required": "Password is required",
    }),
  }),

  // User schemas
  updateProfile: Joi.object({
    username: Joi.string().min(3).max(30).messages({
      "string.min": "Username must be at least 3 characters",
      "string.max": "Username cannot exceed 30 characters",
    }),
    email: Joi.string().email().messages({
      "string.email": "Please enter a valid email address",
    }),
  })
    .min(1)
    .messages({
      "object.min": "At least one field is required to update",
    }),

  // Task schemas
  createTask: Joi.object({
    title: Joi.string().max(100).required().messages({
      "string.max": "Title cannot exceed 100 characters",
      "any.required": "Task title is required",
    }),
    description: Joi.string().max(500).allow("").messages({
      "string.max": "Description cannot exceed 500 characters",
    }),
    status: Joi.boolean().default(false),
    dueDate: Joi.date().iso().allow(null).messages({
      "date.format": "Due date must be a valid date",
    }),
  }),

  updateTask: Joi.object({
    title: Joi.string().max(100).messages({
      "string.max": "Title cannot exceed 100 characters",
    }),
    description: Joi.string().max(500).allow("").messages({
      "string.max": "Description cannot exceed 500 characters",
    }),
    status: Joi.boolean(),
    dueDate: Joi.date().iso().allow(null).messages({
      "date.format": "Due date must be a valid date",
    }),
  })
    .min(1)
    .messages({
      "object.min": "At least one field is required to update",
    }),

  // Query schemas
  taskQuery: Joi.object({
    status: Joi.string().valid("true", "false"),
    sort: Joi.string().valid("dueDate", "-dueDate", "createdAt", "-createdAt"),
  }),
};

module.exports = { validate, schemas };
