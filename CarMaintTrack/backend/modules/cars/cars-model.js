const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    ownerId: {
      type: Number,
      required: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    vin: {
      type: String,
      required: true,
      trim: true,
    },
    licensePlate: {
      type: String,
      required: true,
      trim: true,
    },
    currentMileage: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

const CarModel = mongoose.model("Car", carSchema);

async function getNextCarId() {
  const lastCar = await CarModel.findOne().sort({ id: -1 }).lean();
  return lastCar ? lastCar.id + 1 : 1;
}

/**
 * GET /cars with filtering + pagination + sorting
 * Supported query params:
 * - ownerId
 * - brand
 * - model
 * - minYear, maxYear
 * - minMileage, maxMileage
 * - page, pageSize
 * - sortBy (year | currentMileage | brand | createdAt)
 * - sortOrder (asc | desc)
 */
async function getAllCars(query = {}) {
  const {
    ownerId,
    brand,
    model,
    minYear,
    maxYear,
    minMileage,
    maxMileage,
    page = 1,
    pageSize = 10,
    sortBy = "year",
    sortOrder = "asc",
  } = query;

  const filter = {};

  if (ownerId) {
    filter.ownerId = Number(ownerId);
  }

  if (brand) {
    filter.brand = new RegExp(brand, "i");
  }

  if (model) {
    filter.model = new RegExp(model, "i");
  }

  if (minYear || maxYear) {
    filter.year = {};
    if (minYear) filter.year.$gte = Number(minYear);
    if (maxYear) filter.year.$lte = Number(maxYear);
  }

  if (minMileage || maxMileage) {
    filter.currentMileage = {};
    if (minMileage) filter.currentMileage.$gte = Number(minMileage);
    if (maxMileage) filter.currentMileage.$lte = Number(maxMileage);
  }

  const allowedSortFields = ["year", "currentMileage", "brand", "createdAt"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "year";
  const sortDir = sortOrder === "desc" ? -1 : 1;

  const pageNum = Number(page) || 1;
  const sizeNum = Number(pageSize) || 10;
  const skip = (pageNum - 1) * sizeNum;

  const [cars, total] = await Promise.all([
    CarModel.find(filter)
      .sort({ [sortField]: sortDir })
      .skip(skip)
      .limit(sizeNum)
      .lean(),
    CarModel.countDocuments(filter),
  ]);

  return {
    data: cars,
    pagination: {
      total,
      page: pageNum,
      pageSize: sizeNum,
      totalPages: Math.ceil(total / sizeNum),
    },
  };
}

async function getCarById(id) {
  return await CarModel.findOne({ id }).lean();
}

async function getCarsByOwner(ownerId) {
  return await CarModel.find({ ownerId }).lean();
}

async function createCar(data) {
  const newId = await getNextCarId();

  const car = await CarModel.create({
    id: newId,
    ownerId: data.ownerId,
    brand: data.brand,
    model: data.model,
    year: data.year,
    vin: data.vin,
    licensePlate: data.licensePlate,
    currentMileage: data.currentMileage,
  });

  return car.toObject();
}

async function updateCar(id, data) {
  const updated = await CarModel.findOneAndUpdate({ id }, data, {
    new: true,
    lean: true,
  });
  return updated; // null if not found
}

async function deleteCar(id) {
  const result = await CarModel.deleteOne({ id });
  return result.deletedCount > 0;
}

module.exports = {
  getAllCars,
  getCarById,
  getCarsByOwner,
  createCar,
  updateCar,
  deleteCar,
};
