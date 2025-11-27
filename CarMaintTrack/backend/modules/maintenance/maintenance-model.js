const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    carId: {
      type: Number,
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
      trim: true,
    },
    serviceDate: {
      type: Date,
      required: true,
    },
    mileageAtService: {
      type: Number,
      required: true,
      min: 0,
    },
    cost: {
      type: Number,
      default: null,
      min: 0,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    performedBy: {
      type: String,
      default: "Unknown",
      trim: true,
    },
  },
  { timestamps: true }
);

const MaintenanceModel = mongoose.model("MaintenanceRecord", maintenanceSchema);

async function getNextMaintenanceId() {
  const last = await MaintenanceModel.findOne().sort({ id: -1 }).lean();
  return last ? last.id + 1 : 1;
}

async function getAllMaintenance(query = {}) {
  const { carId, page = 1, pageSize = 10 } = query;

  const filter = {};
  if (carId) {
    filter.carId = Number(carId);
  }

  const pageNum = Number(page) || 1;
  const sizeNum = Number(pageSize) || 10;
  const skip = (pageNum - 1) * sizeNum;

  const [records, total] = await Promise.all([
    MaintenanceModel.find(filter).sort({ serviceDate: -1 }).skip(skip).limit(sizeNum).lean(),
    MaintenanceModel.countDocuments(filter),
  ]);

  return {
    data: records,
    pagination: {
      total,
      page: pageNum,
      pageSize: sizeNum,
      totalPages: Math.ceil(total / sizeNum),
    },
  };
}

async function getMaintenanceById(id) {
  return await MaintenanceModel.findOne({ id }).lean();
}

async function getMaintenanceByCarId(carId) {
  return await MaintenanceModel.find({ carId }).sort({ serviceDate: -1 }).lean();
}

async function createMaintenance(data) {
  const newId = await getNextMaintenanceId();

  const record = await MaintenanceModel.create({
    id: newId,
    carId: data.carId,
    serviceType: data.serviceType,
    serviceDate: data.serviceDate,
    mileageAtService: data.mileageAtService,
    cost: data.cost ?? null,
    notes: data.notes || "",
    performedBy: data.performedBy || "Unknown",
  });

  return record.toObject();
}

async function updateMaintenance(id, data) {
  const updated = await MaintenanceModel.findOneAndUpdate({ id }, data, {
    new: true,
    lean: true,
  });
  return updated;
}

async function deleteMaintenance(id) {
  const result = await MaintenanceModel.deleteOne({ id });
  return result.deletedCount > 0;
}

module.exports = {
  getAllMaintenance,
  getMaintenanceById,
  getMaintenanceByCarId,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
};
