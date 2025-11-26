const { readJson, writeJson } = require("../../shared/utils/file-utils");

const USERS_FILE = "data/users.json";

async function getAllUsers() {
  return await readJson(USERS_FILE);
}

async function getUserById(id) {
  const users = await getAllUsers();
  return users.find((u) => u.id === id) || null;
}

async function createUser(data) {
  const users = await getAllUsers();
  const newId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;

  const newUser = {
    id: newId,
    name: data.name,
    email: data.email,
    role: data.role || "owner",
  };

  users.push(newUser);
  await writeJson(USERS_FILE, users);
  return newUser;
}

async function updateUser(id, data) {
  const users = await getAllUsers();
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) return null;

  users[index] = {
    ...users[index],
    ...data,
  };

  await writeJson(USERS_FILE, users);
  return users[index];
}

async function deleteUser(id) {
  const users = await getAllUsers();
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) return false;

  users.splice(index, 1);
  await writeJson(USERS_FILE, users);
  return true;
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
