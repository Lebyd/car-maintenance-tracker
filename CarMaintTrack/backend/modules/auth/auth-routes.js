const { Router } = require("express");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

// ІМПОРТУЄМО ФУНКЦІЇ з users-model.js
const {
  getAllUsers,
  createUser,
} = require("../users/users-model");

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "supersecret123";

// helper для перевірки валідації
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

/**
 * POST /auth/register
 * Body: { name, email, password, role? }
 */
router.post(
  "/auth/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("role").optional().isIn(["owner", "mechanic", "admin"]),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { name, email, password, role = "owner" } = req.body;

      // 1. Перевіряємо, чи email вже є в базі
      const users = await getAllUsers();
      const existing = users.find((u) => u.email === email);
      if (existing) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // 2. Хешуємо пароль
      const hashedPw = await bcrypt.hash(password, 10);

      // 3. Створюємо користувача через createUser з users-model
      const newUser = await createUser({
        name,
        email,
        password: hashedPw,
        role,
      });

      return res.json({
        message: "User registered",
        userId: newUser.id,
      });
    } catch (err) {
      console.error("Register error:", err);
      return res.status(500).json({ message: "Server error", err });
    }
  }
);

/**
 * POST /auth/login
 * Body: { email, password }
 */
router.post(
  "/auth/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // 1. Знаходимо користувача по email серед усіх
      const users = await getAllUsers();
      const user = users.find((u) => u.email === email);

      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // 2. Перевіряємо пароль
      if (!user.password) {
        // якщо у старих юзерів ще немає password – підказка
        return res
          .status(400)
          .json({ message: "This user has no password saved. Please register again." });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // 3. Створюємо JWT
      const token = jwt.sign(
        { id: user.id, role: user.role, name: user.name },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({ message: "Login successful", token });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Server error", err });
    }
  }
);

module.exports = router;
