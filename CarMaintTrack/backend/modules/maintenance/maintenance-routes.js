const express = require("express");
const { validationResult } = require("express-validator");
const {
  getAllMaintenance,
  getMaintenanceById,
  getMaintenanceByCarId,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
} = require("./maintenance-model");
const {
  createMaintenanceRules,
  updateMaintenanceRules,
} = require("./middlewares/maintenance-validation");

const maintenanceRouter = express.Router();

// GET /maintenance
// optional: /maintenance?carId=1
maintenanceRouter.get("/maintenance", async (req, res, next) => {
  try {
    const carId = req.query.carId ? Number(req.query.carId) : null;

    if (carId) {
      const records = await getMaintenanceByCarId(carId);
      return res.json(records);
    }

    const records = await getAllMaintenance();
    res.json(records);
  } catch (error) {
    next(error);
  }
});

// GET /maintenance/:id
maintenanceRouter.get("/maintenance/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const record = await getMaintenanceById(id);

    if (!record) {
      return res.status(404).json({ error: "Maintenance record not found" });
    }

    res.json(record);
  } catch (error) {
    next(error);
  }
});

// POST /maintenance
maintenanceRouter.post(
  "/maintenance",
  createMaintenanceRules,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const created = await createMaintenance(req.body);
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /maintenance/:id
maintenanceRouter.put(
  "/maintenance/:id",
  updateMaintenanceRules,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const id = Number(req.params.id);
      const updated = await updateMaintenance(id, req.body);

      if (!updated) {
        return res.status(404).json({ error: "Maintenance record not found" });
      }

      res.json(updated);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /maintenance/:id
maintenanceRouter.delete("/maintenance/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const deleted = await deleteMaintenance(id);

    if (!deleted) {
      return res.status(404).json({ error: "Maintenance record not found" });
    }

    res.json({ message: "Maintenance record deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = maintenanceRouter;
