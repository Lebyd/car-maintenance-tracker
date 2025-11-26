# Car Maintenance Tracker – Phase 2  
### Modular Express Architecture with JSON Data Storage

## Project Overview
Car Maintenance Tracker is a backend application built using Node.js and Express.js.  
It allows managing users, cars, and maintenance records.  
This phase focuses on building a modular Express architecture, implementing CRUD operations, validation, and using JSON files.

---

## Phase 2 – Completed Tasks

### 1. Data Structure Created
Three JSON files were created to serve as the initial data source:
backend/data/users.json
backend/data/cars.json
backend/data/maintenanceRecords.json

Each file contains meaningful sample data representing the entities used in the system.

---

### 2. Modular Architecture Implemented
The project follows a feature-based module structure, as required in Phase 2:
modules/
models/
routes/
middlewares/


Modules created:
- users
- cars
- maintenance

---

### 3. CRUD Logic Implemented in Models
Each model handles business logic and JSON data operations:

- `getAll<Entity>()`
- `get<Entity>ById(id)`
- `create<Entity>(data)`
- `update<Entity>(id, data)`
- `delete<Entity>(id)`

All read/write operations are done using the filesystem (`fs`) through a shared utility.

---

### 4. Independent Routes Implemented
Each module uses **Express Router** and includes:

- `GET /<entity>`
- `GET /<entity>/:id`
- `POST /<entity>`
- `PUT /<entity>/:id`
- `DELETE /<entity>/:id`

All routes correctly return JSON responses and use appropriate HTTP status codes.

---

### 5. Input Validation Added (express-validator)
Validation rules were applied for POST and PUT requests for each entity:

- Required fields
- Email validation
- Numeric and date validation
- Role constraints
- Empty field restrictions

Invalid requests return **400 Bad Request** with a list of validation errors.

---

### 6. Application-Level Middlewares Added
Implemented in `server.js`:

- `express.json()`  
- `express.urlencoded({ extended: true })`
- 404 Not Found handler
- Global error-handling middleware

---

### 7. Endpoints Tested using Postman
Verified:

- GET returns correct JSON data
- POST successfully creates new entries
- PUT updates entries
- DELETE removes entries
- Validation properly blocks invalid requests
- 404 handler returns JSON error
- Error handler works correctly

---

## Project Structure (Phase 2)
backend/
├── data/
│ ├── users.json
│ ├── cars.json
│ └── maintenanceRecords.json
│
├── modules/
│ ├── users/
│ │ ├── users-model.js
│ │ ├── users-routes.js
│ │ └── middlewares/users-validation.js
│ │
│ ├── cars/
│ │ ├── cars-model.js
│ │ ├── cars-routes.js
│ │ └── middlewares/cars-validation.js
│ │
│ └── maintenance/
│ ├── maintenance-model.js
│ ├── maintenance-routes.js
│ └── middlewares/maintenance-validation.js
│
├── shared/
│ ├── utils/file-utils.js
│ └── middlewares/
│ ├── not-found.js
│ └── error-handler.js
│
├── server.js
└── package.json

---

## How to Run

cd backend
npm install
node server.js

GET    /users
GET    /users/:id
POST   /users
PUT    /users/:id
DELETE /users/:id

GET    /cars
GET    /cars?ownerId=1
GET    /cars/:id
POST   /cars
PUT    /cars/:id
DELETE /cars/:id

GET    /maintenance
GET    /maintenance?carId=1
GET    /maintenance/:id
POST   /maintenance
PUT    /maintenance/:id
DELETE /maintenance/:id

## Team Member Contributions

Oleksandr Kurochka





