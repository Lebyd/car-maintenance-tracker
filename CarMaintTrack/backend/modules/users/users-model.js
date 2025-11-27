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
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["owner", "mechanic", "admin"],
      default: "owner",
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

async function getNextUserId() {
  const lastUser = await UserModel.findOne().sort({ id: -1 }).lean();
  return lastUser ? lastUser.id + 1 : 1;
}

async function getAllUsers() {
  return await UserModel.find().lean();
}

async function getUserById(id) {
  return await UserModel.findOne({ id }).lean();
}

async function createUser(data) {
  const newId = await getNextUserId();

  const user = await UserModel.create({
    id: newId,
    name: data.name,
    email: data.email,
    role: data.role || "owner",
  });

  return user.toObject();
}

async function updateUser(id, data) {
  const updated = await UserModel.findOneAndUpdate({ id }, data, {
    new: true,
    lean: true,
  });

  return updated; // null if not found
}

async function deleteUser(id) {
  const result = await UserModel.deleteOne({ id });
  return result.deletedCount > 0;
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
