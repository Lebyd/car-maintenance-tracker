Car Maintenance Tracker
Phase 2 & Phase 3 – Backend API (Express + MongoDB)

A backend application for managing users, cars, and maintenance records.
Built using Node.js, Express, and MongoDB (Mongoose) with a clean modular folder structure.

This repository currently includes:
 Phase 2: Modular backend + CRUD + validation
 Phase 3: MongoDB integration + advanced filtering/pagination

 Project Overview

The Car Maintenance Tracker allows:
Creating and managing users (owners, mechanics, admin)
Adding and updating cars linked to specific users
Recording maintenance history for each car
Searching, filtering, and paginating data

Phase 3 – MongoDB Integration & Enhancements

Phase 3 improved the backend with MongoDB Atlas and Mongoose, replacing JSON file storage.

 MongoDB & Mongoose Setup

Connection string stored safely in .env:
MONGODB_URI="mongodb+srv://<USER>:<PASS>@<cluster>.mongodb.net/CarMaintTrackDB"

Connection is handled inside:
backend/shared/middlewares/connect-db.js

Mongoose Models

All models now use MongoDB collections:

User

Car

MaintenanceRecord

Each model preserves the numeric id from Phase 2 for compatibility.

 Advanced Car Query API

GET /cars now supports:

Filters:
ownerId
brand
model
minYear / maxYear
minMileage / maxMileage

Sorting:
sortBy = year | currentMileage | brand | createdAt
sortOrder = asc | desc

Pagination:
page
pageSize

Example:
/cars?brand=BMW&minYear=2015&page=1&pageSize=5&sortBy=year&sortOrder=desc


 Folder Structure
 backend/
├── data/                     
│
├── modules/
│   ├── users/
│   ├── cars/
│   └── maintenance/
│
├── shared/
│   ├── middlewares/
│   └── utils/
│
├── server.js
├── .env
├── package.json
└── package-lock.json


How to Run
1 Install dependencies
cd backend
npm install

2 Add .env file
Inside backend/.env: MONGODB_URI="mongodb+srv://<USER>:<PASS>@<cluster>.mongodb.net/CarMaintTrackDB"

3️ Start the server
node server.js

API Endpoints:

Users
GET    /users
GET    /users/:id
POST   /users
PUT    /users/:id
DELETE /users/:id

Cars
GET    /cars
GET    /cars/:id
GET    /cars?ownerId=1
POST   /cars
PUT    /cars/:id
DELETE /cars/:id

Advanced:
GET /cars?brand=BMW&minYear=2018&page=1&pageSize=5&sortBy=year&sortOrder=desc

Maintenance Records
GET    /maintenance
GET    /maintenance/:id
GET    /maintenance?carId=1
POST   /maintenance
PUT    /maintenance/:id
DELETE /maintenance/:id

Author
Oleksandr Kurochka
