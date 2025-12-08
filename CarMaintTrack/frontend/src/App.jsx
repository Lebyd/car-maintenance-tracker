import { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import CarsPage from "./pages/CarsPage";
import UsersPage from "./pages/UsersPage";
import MaintenancePage from "./pages/MaintenancePage";
import LoginPage from "./pages/LoginPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("authToken")
  );

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">Car Maintenance Tracker</div>
        <div className="navbar-links">
          <Link to="/">Cars</Link>
          <Link to="/users">Users</Link>
          <Link to="/maintenance">Maintenance</Link>
          {!isLoggedIn ? (
            <Link to="/login">Login</Link>
          ) : (
            <button className="btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </nav>

      <main className="main">
        <Routes>
          <Route path="/" element={<CarsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route
            path="/login"
            element={<LoginPage onLogin={handleLoginSuccess} />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
