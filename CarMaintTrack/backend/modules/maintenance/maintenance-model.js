const { readJson, writeJson } = require("../../shared/utils/file-utils");

const MAINTENANCE_FILE = "data/maintenanceRecords.json";

async function getAllMaintenance() {
  return await readJson(MAINTENANCE_FILE);
}

async function getMaintenanceById(id) {
  const records = await getAllMaintenance();
  return records.find((r) => r.id === id) || null;
}

async function getMaintenanceByCarId(carId) {
  const records = await getAllMaintenance();
  return records.filter((r) => r.carId === carId);
}

async function createMaintenance(data) {
  const records = await getAllMaintenance();
  const newId = records.length ? Math.max(...records.map((r) => r.id)) + 1 : 1;

  const newRecord = {
    id: newId,
    carId: data.carId,
    serviceType: data.serviceType,
    serviceDate: data.serviceDate,
    mileageAtService: data.mileageAtService,
    cost: data.cost ?? null,
    notes: data.notes || "",
    performedBy: data.performedBy || "Unknown",
  };

  records.push(newRecord);
  await writeJson(MAINTENANCE_FILE, records);
  return newRecord;
}

async function updateMaintenance(id, data) {
  const records = await getAllMaintenance();
  const index = records.findIndex((r) => r.id === id);
  if (index === -1) return null;

  records[index] = {
    ...records[index],
    ...data,
  };

  await writeJson(MAINTENANCE_FILE, records);
  return records[index];
}

async function deleteMaintenance(id) {
  const records = await getAllMaintenance();
  const index = records.findIndex((r) => r.id === id);
  if (index === -1) return false;

  records.splice(index, 1);
  await writeJson(MAINTENANCE_FILE, records);
  return true;
}

module.exports = {
  getAllMaintenance,
  getMaintenanceById,
  getMaintenanceByCarId,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
};
