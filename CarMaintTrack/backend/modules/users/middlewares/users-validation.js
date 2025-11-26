const { body } = require("express-validator");

const createUserRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["owner", "mechanic", "admin"])
    .withMessage("Role must be owner, mechanic or admin"),
];

const updateUserRules = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Invalid email format"),

  body("role")
    .optional()
    .trim()
    .isIn(["owner", "mechanic", "admin"])
    .withMessage("Role must be owner, mechanic or admin"),
];

module.exports = {
  createUserRules,
  updateUserRules,
};
