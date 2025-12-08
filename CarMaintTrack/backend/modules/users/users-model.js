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
    // NEW: store hashed password here
    password: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["owner", "mechanic", "admin"],
      default: "owner",
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

// Create new user
async function createUser(data) {
  // find max id
  const last = await UserModel.findOne().sort({ id: -1 }).lean();
  const nextId = last ? last.id + 1 : 1;

  const user = new UserModel({
    id: nextId,
    name: data.name,
    email: data.email,
    password: data.password || null, // important for auth
    role: data.role || "owner",
  });

  const saved = await user.save();
  return saved.toObject();
}

// Update user
async function updateUser(id, data) {
  const updated = await UserModel.findOneAndUpdate(
    { id },
    {
      $set: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.password !== undefined && { password: data.password }),
        ...(data.role !== undefined && { role: data.role }),
      },
    },
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
  createUser,
  updateUser,
  deleteUser,
};
