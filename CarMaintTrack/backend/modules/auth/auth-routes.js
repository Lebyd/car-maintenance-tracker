const { Router } = require("express");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const {
  getAllUsers,
  createUser,
  updateUser,
} = require("../users/users-model");

const { sendOtpEmail } = require("../../shared/utils/email");

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret123";

// Helper for validation errors
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

/* ----------------------------------------------------
   REGISTER
---------------------------------------------------- */
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

      const users = await getAllUsers();
      const existing = users.find((u) => u.email === email);

      if (existing) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const hashedPw = await bcrypt.hash(password, 10);

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

/* ----------------------------------------------------
   REQUEST OTP (send email)
---------------------------------------------------- */
router.post(
  "/auth/request-otp",
  [body("email").isEmail().withMessage("Valid email required")],
  handleValidation,
  async (req, res) => {
    try {
      const { email } = req.body;

      const users = await getAllUsers();
      const user = users.find((u) => u.email === email);

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Save OTP in database
      await updateUser(user.id, {
        otpCode: otp,
        otpExpiresAt: expires,
      });

      // Send OTP via email
      await sendOtpEmail(email, otp);

      console.log(`OTP for ${email}: ${otp}`);

      return res.json({
        message: "OTP sent to your email.",
        expiresAt: expires,
      });
    } catch (err) {
      console.error("Request OTP error:", err);
      return res.status(500).json({ message: "Server error", err });
    }
  }
);

/* ----------------------------------------------------
   LOGIN (email + password + OTP)
---------------------------------------------------- */
router.post(
  "/auth/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password is required"),
    body("otp").notEmpty().withMessage("OTP code is required"),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { email, password, otp } = req.body;

      const users = await getAllUsers();
      const user = users.find((u) => u.email === email);

      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      if (!user.password) {
        return res.status(400).json({
          message: "This user has no password saved. Please register again.",
        });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // MFA checks
      if (!user.otpCode || !user.otpExpiresAt) {
        return res
          .status(400)
          .json({ message: "OTP not requested. Please request a new OTP." });
      }

      if (new Date() > new Date(user.otpExpiresAt)) {
        return res
          .status(400)
          .json({ message: "OTP expired. Request a new one." });
      }

      if (user.otpCode !== otp) {
        return res.status(400).json({ message: "Invalid OTP code." });
      }

      // OTP success → clear it
      await updateUser(user.id, {
        otpCode: null,
        otpExpiresAt: null,
      });

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, role: user.role, name: user.name },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        message: "Login successful",
        token,
      });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Server error", err });
    }
  }
);

module.exports = router;
