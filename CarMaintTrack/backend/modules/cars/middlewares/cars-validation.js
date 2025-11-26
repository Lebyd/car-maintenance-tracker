const { body } = require("express-validator");

const createCarRules = [
  body("ownerId")
    .notEmpty()
    .withMessage("ownerId is required")
    .isInt({ min: 1 })
    .withMessage("ownerId must be a positive integer"),

  body("brand")
    .trim()
    .notEmpty()
    .withMessage("Brand is required"),

  body("model")
    .trim()
    .notEmpty()
    .withMessage("Model is required"),

  body("year")
    .notEmpty()
    .withMessage("Year is required")
    .isInt({ min: 1950, max: 2100 })
    .withMessage("Year must be a valid number"),

  body("vin")
    .trim()
    .notEmpty()
    .withMessage("VIN is required"),

  body("licensePlate")
    .trim()
    .notEmpty()
    .withMessage("License plate is required"),

  body("currentMileage")
    .notEmpty()
    .withMessage("Current mileage is required")
    .isInt({ min: 0 })
    .withMessage("Mileage must be a positive integer"),
];

const updateCarRules = [
  body("ownerId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("ownerId must be a positive integer"),

  body("brand").optional().trim().notEmpty(),
  body("model").optional().trim().notEmpty(),
  body("year")
    .optional()
    .isInt({ min: 1950, max: 2100 })
    .withMessage("Year must be a valid number"),

  body("vin").optional().trim().notEmpty(),
  body("licensePlate").optional().trim().notEmpty(),
  body("currentMileage")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Mileage must be a positive integer"),
];

module.exports = {
  createCarRules,
  updateCarRules,
};
