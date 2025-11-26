const { readJson, writeJson } = require("../../shared/utils/file-utils");

const CARS_FILE = "data/cars.json";

async function getAllCars() {
  return await readJson(CARS_FILE);
}

async function getCarById(id) {
  const cars = await getAllCars();
  return cars.find((c) => c.id === id) || null;
}

async function getCarsByOwner(ownerId) {
  const cars = await getAllCars();
  return cars.filter((c) => c.ownerId === ownerId);
}

async function createCar(data) {
  const cars = await getAllCars();
  const newId = cars.length ? Math.max(...cars.map((c) => c.id)) + 1 : 1;

  const newCar = {
    id: newId,
    ownerId: data.ownerId,
    brand: data.brand,
    model: data.model,
    year: data.year,
    vin: data.vin,
    licensePlate: data.licensePlate,
    currentMileage: data.currentMileage,
  };

  cars.push(newCar);
  await writeJson(CARS_FILE, cars);
  return newCar;
}

async function updateCar(id, data) {
  const cars = await getAllCars();
  const index = cars.findIndex((c) => c.id === id);
  if (index === -1) return null;

  cars[index] = {
    ...cars[index],
    ...data,
  };

  await writeJson(CARS_FILE, cars);
  return cars[index];
}

async function deleteCar(id) {
  const cars = await getAllCars();
  const index = cars.findIndex((c) => c.id === id);
  if (index === -1) return false;

  cars.splice(index, 1);
  await writeJson(CARS_FILE, cars);
  return true;
}

module.exports = {
  getAllCars,
  getCarById,
  getCarsByOwner,
  createCar,
  updateCar,
  deleteCar,
};
