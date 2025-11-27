const express = require("express");
const { validationResult } = require("express-validator");
const {
  getAllCars,
  getCarById,
  getCarsByOwner,
  createCar,
  updateCar,
  deleteCar,
} = require("./cars-model");
const {
  createCarRules,
  updateCarRules,
} = require("./middlewares/cars-validation");

const carsRouter = express.Router();

/**
 * GET /cars
 * Supports filters & pagination via query params:
 * - ownerId
 * - brand, model
 * - minYear, maxYear
 * - minMileage, maxMileage
 * - page, pageSize
 * - sortBy, sortOrder
 */
carsRouter.get("/cars", async (req, res, next) => {
  try {
    // If only ownerId is provided and no other filters,
    // you can still use getCarsByOwner (optional optimization)
    if (
      req.query.ownerId &&
      !req.query.brand &&
      !req.query.model &&
      !req.query.minYear &&
      !req.query.maxYear &&
      !req.query.minMileage &&
      !req.query.maxMileage
    ) {
      const cars = await getCarsByOwner(Number(req.query.ownerId));
      return res.json(cars);
    }

    const result = await getAllCars(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// GET /cars/:id
carsRouter.get("/cars/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const car = await getCarById(id);

    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json(car);
  } catch (error) {
    next(error);
  }
});

// POST /cars
carsRouter.post("/cars", createCarRules, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newCar = await createCar(req.body);
    res.status(201).json(newCar);
  } catch (error) {
    next(error);
  }
});

// PUT /cars/:id
carsRouter.put("/cars/:id", updateCarRules, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = Number(req.params.id);
    const updated = await updateCar(id, req.body);

    if (!updated) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// DELETE /cars/:id
carsRouter.delete("/cars/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const deleted = await deleteCar(id);

    if (!deleted) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = carsRouter;
