const { body } = require("express-validator");

const createMaintenanceRules = [
  body("carId")
    .notEmpty()
    .withMessage("carId is required")
    .isInt({ min: 1 })
    .withMessage("carId must be a positive integer"),

  body("serviceType")
    .trim()
    .notEmpty()
    .withMessage("serviceType is required"),

  body("serviceDate")
    .trim()
    .notEmpty()
    .withMessage("serviceDate is required")
    .isISO8601()
    .withMessage("serviceDate must be a valid date"),

  body("mileageAtService")
    .notEmpty()
    .withMessage("mileageAtService is required")
    .isInt({ min: 0 })
    .withMessage("mileageAtService must be a positive integer"),

  body("cost")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("cost must be a positive number"),
];

const updateMaintenanceRules = [
  body("carId").optional().isInt({ min: 1 }),
  body("serviceType").optional().trim().notEmpty(),
  body("serviceDate").optional().isISO8601(),
  body("mileageAtService").optional().isInt({ min: 0 }),
  body("cost").optional().isFloat({ min: 0 }),
];

module.exports = {
  createMaintenanceRules,
  updateMaintenanceRules,
};
