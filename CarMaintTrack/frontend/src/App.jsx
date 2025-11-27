import { Routes, Route, Link } from "react-router-dom";
import CarsPage from "./pages/CarsPage";
import UsersPage from "./pages/UsersPage";
import MaintenancePage from "./pages/MaintenancePage";

function App() {
  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">Car Maintenance Tracker</div>
        <div className="navbar-links">
          <Link to="/">Cars</Link>
          <Link to="/users">Users</Link>
          <Link to="/maintenance">Maintenance</Link>
        </div>
      </nav>

      <main className="main">
        <Routes>
          <Route path="/" element={<CarsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
