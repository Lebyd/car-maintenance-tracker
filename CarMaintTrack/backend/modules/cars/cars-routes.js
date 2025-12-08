const { Router } = require("express");
const {
  body,
  param,
  query,
  validationResult,
} = require("express-validator");

const {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} = require("./cars-model");

const { isAuthenticated, requireRole } = require("../../shared/middlewares/auth");

const carsRouter = Router();

/**
 * Helper to handle validation errors
 */
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

/**
 * GET /cars
 * Supports filtering, sorting, and pagination via query parameters:
 * - ownerId
 * - brand
 * - model
 * - minYear, maxYear
 * - minMileage, maxMileage
 * - page, pageSize
 * - sortBy, sortOrder
 */
carsRouter.get(
  "/cars",
  [
    query("ownerId").optional().isInt({ min: 1 }).toInt(),
    query("minYear").optional().isInt().toInt(),
    query("maxYear").optional().isInt().toInt(),
    query("minMileage").optional().isInt({ min: 0 }).toInt(),
    query("maxMileage").optional().isInt({ min: 0 }).toInt(),
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("pageSize").optional().isInt({ min: 1 }).toInt(),
    query("sortBy").optional().isString(),
    query("sortOrder")
      .optional()
      .isIn(["asc", "desc"])
      .withMessage("sortOrder must be 'asc' or 'desc'"),
  ],
  handleValidation,
  async (req, res, next) => {
    try {
      const filters = {
        ownerId: req.query.ownerId,
        brand: req.query.brand,
        model: req.query.model,
        minYear: req.query.minYear,
        maxYear: req.query.maxYear,
        minMileage: req.query.minMileage,
        maxMileage: req.query.maxMileage,
        page: req.query.page,
        pageSize: req.query.pageSize,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder,
      };

      const result = await getAllCars(filters);
      // getAllCars should return either an array or { data, pagination }
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /cars/:id
 */
carsRouter.get(
  "/cars/:id",
  [param("id").isInt({ min: 1 }).withMessage("Invalid car id")],
  handleValidation,
  async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const car = await getCarById(id);

      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }

      res.json(car);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /cars
 * Protected: requires authentication
 */
carsRouter.post(
  "/cars",
  isAuthenticated,
  [
    body("ownerId")
      .isInt({ min: 1 })
      .withMessage("ownerId must be a positive integer"),
    body("brand").notEmpty().withMessage("Brand is required"),
    body("model").notEmpty().withMessage("Model is required"),
    body("year").isInt({ min: 1886 }).withMessage("Valid year is required"),
    body("vin").notEmpty().withMessage("VIN is required"),
    body("licensePlate").optional().isString(),
    body("currentMileage")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Mileage must be >= 0"),
  ],
  handleValidation,
  async (req, res, next) => {
    try {
      const newCar = await createCar(req.body);
      res.status(201).json(newCar);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PUT /cars/:id
 * Protected: requires authentication
 */
carsRouter.put(
  "/cars/:id",
  isAuthenticated,
  [
    param("id").isInt({ min: 1 }).withMessage("Invalid car id"),
    body("ownerId")
      .optional()
      .isInt({ min: 1 })
      .withMessage("ownerId must be a positive integer"),
    body("brand").optional().notEmpty().withMessage("Brand cannot be empty"),
    body("model").optional().notEmpty().withMessage("Model cannot be empty"),
    body("year")
      .optional()
      .isInt({ min: 1886 })
      .withMessage("Valid year is required"),
    body("vin").optional().notEmpty().withMessage("VIN cannot be empty"),
    body("licensePlate").optional().isString(),
    body("currentMileage")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Mileage must be >= 0"),
  ],
  handleValidation,
  async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const updated = await updateCar(id, req.body);

      if (!updated) {
        return res.status(404).json({ message: "Car not found" });
      }

      res.json(updated);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /cars/:id
 * Protected: requires admin role
 */
carsRouter.delete(
  "/cars/:id",
  isAuthenticated,
  requireRole("admin"),
  [param("id").isInt({ min: 1 }).withMessage("Invalid car id")],
  handleValidation,
  async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const deleted = await deleteCar(id);

      if (!deleted) {
        return res.status(404).json({ message: "Car not found" });
      }

      res.json({ message: "Car deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = carsRouter;
