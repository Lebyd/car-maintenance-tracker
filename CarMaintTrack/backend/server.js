// Load environment variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Feature routers
const usersRouter = require("./modules/users/users-routes");
const carsRouter = require("./modules/cars/cars-routes");
const maintenanceRouter = require("./modules/maintenance/maintenance-routes");
const authRouter = require("./modules/auth/auth-routes");

// Shared middlewares
const connectDb = require("./shared/middlewares/connect-db");
const notFoundHandler = require("./shared/middlewares/not-found");
const errorHandler = require("./shared/middlewares/error-handler");

const app = express();
const PORT = 3000;

// Enable CORS for frontend (Phase 4/5)
app.use(cors());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB before handling any routes
app.use(connectDb);

// Auth routes (register, login)
app.use(authRouter);

// Feature routes
app.use(usersRouter);
app.use(carsRouter);
app.use(maintenanceRouter);

// 404 & error handlers
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
