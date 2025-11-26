const express = require("express");
const { validationResult } = require("express-validator");

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("./users-model");

const {
  createUserRules,
  updateUserRules,
} = require("./middlewares/users-validation");

const usersRouter = express.Router();

// GET /users
usersRouter.get("/users", async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// GET /users/:id
usersRouter.get("/users/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// POST /users
usersRouter.post("/users", createUserRules, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newUser = await createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

// PUT /users/:id
usersRouter.put("/users/:id", updateUserRules, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = Number(req.params.id);
    const updated = await updateUser(id, req.body);

    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// DELETE /users/:id
usersRouter.delete("/users/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const deleted = await deleteUser(id);

    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
