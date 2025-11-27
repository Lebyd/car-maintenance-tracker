Phase 4 – Frontend (React)
Car Maintenance Tracker – Modern Web Project

This phase implements the frontend user interface for the Car Maintenance Tracker using React (Vite).
The UI communicates with the backend API created in Phases 2–3 (Node.js + Express + MongoDB).

The frontend includes:
 Cars Page – full CRUD + filters + sorting
 Users Page – full CRUD
 Maintenance Page – full CRUD + filters
 Navigation bar between pages
 Connection to backend API using Axios
 State management using React hooks (useState, useEffect)
 Basic responsive UI styling

Backend Connection
Axios client is configured in: src/api/apiClient.js:

CORS was enabled in backend (server.js): app.use(cors());

Navigation (React Router)
The app uses React Router to switch between pages.

App.jsx:
<Routes>
  <Route path="/" element={<CarsPage />} />
  <Route path="/users" element={<UsersPage />} />
  <Route path="/maintenance" element={<MaintenancePage />} />
</Routes>

Navigation bar:
<nav className="navbar">
  <Link to="/">Cars</Link>
  <Link to="/users">Users</Link>
  <Link to="/maintenance">Maintenance</Link>
</nav>

Cars Page – Features
Location: src/pages/CarsPage.jsx

 Features:
View all cars
Add new car
Delete car
Advanced filtering:
    ownerId
    brand
    minYear / maxYear
Sorting:
    by year
    by brand
    by mileage
    ascending / descending

Success & error messages

Clean UI layout (cards, tables, alerts)
API endpoints used:
GET    /users
POST   /users
DELETE /users/:id

How to Run
1 Install dependencies
cd frontend
npm install

2 Start development server
npm run dev

Backend must also be running:
cd backend
node server.js

Author 
Oleksandr Kurochka
