const mongoose = require("mongoose");

let isConnecting = false;

async function connectDb(req, res, next) {
  try {
    if (mongoose.connection.readyState === 1) {
      // already connected
      return next();
    }

    if (!isConnecting) {
      isConnecting = true;
      const uri = process.env.MONGODB_URI;

      if (!uri) {
        throw new Error("MONGODB_URI is not defined in .env");
      }

      await mongoose.connect(uri);
      console.log("MongoDB connected");
      isConnecting = false;
    }

    return next();
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return next(error);
  }
}

module.exports = connectDb;
