const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // Hashed password (bcrypt)
    password: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["owner", "mechanic", "admin"],
      default: "owner",
    },
    // MFA fields (OTP)
    otpCode: {
      type: String,
      default: null,
    },
    otpExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", userSchema);

// Get all users
async function getAllUsers() {
  return UserModel.find().sort({ id: 1 }).lean();
}

// Get user by numeric id
async function getUserById(id) {
  return UserModel.findOne({ id }).lean();
}

// OPTIONAL: get by email (можеш не використовувати, але хай буде)
async function getUserByEmail(email) {
  return UserModel.findOne({ email }).lean();
}

// Create new user
async function createUser(data) {
  const last = await UserModel.findOne().sort({ id: -1 }).lean();
  const nextId = last ? last.id + 1 : 1;

  const user = new UserModel({
    id: nextId,
    name: data.name,
    email: data.email,
    password: data.password || null,
    role: data.role || "owner",
    otpCode: data.otpCode || null,
    otpExpiresAt: data.otpExpiresAt || null,
  });

  const saved = await user.save();
  return saved.toObject();
}

// Update user (включає OTP-поля!)
async function updateUser(id, data) {
  const update = {};

  if (data.name !== undefined) update.name = data.name;
  if (data.email !== undefined) update.email = data.email;
  if (data.password !== undefined) update.password = data.password;
  if (data.role !== undefined) update.role = data.role;
  if (data.otpCode !== undefined) update.otpCode = data.otpCode;
  if (data.otpExpiresAt !== undefined) update.otpExpiresAt = data.otpExpiresAt;

  const updated = await UserModel.findOneAndUpdate(
    { id },
    { $set: update },
    { new: true, lean: true }
  );

  return updated;
}

// Delete user
async function deleteUser(id) {
  const res = await UserModel.deleteOne({ id });
  return res.deletedCount > 0;
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
};
