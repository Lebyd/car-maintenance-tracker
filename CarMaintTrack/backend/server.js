const express = require("express");

const usersRouter = require("./modules/users/users-routes");
const carsRouter = require("./modules/cars/cars-routes");
const maintenanceRouter = require("./modules/maintenance/maintenance-routes");

const notFoundHandler = require("./shared/middlewares/not-found");
const errorHandler = require("./shared/middlewares/error-handler");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use(usersRouter);
app.use(carsRouter);
app.use(maintenanceRouter);

// 404 & error handlers
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
