import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";

import CarsPage from "./pages/CarsPage";
import UsersPage from "./pages/UsersPage";
import MaintenancePage from "./pages/MaintenancePage";
import LoginPage from "./pages/LoginPage";

function App() {
  // Початковий стан — залогінений, якщо в localStorage вже є токен
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("authToken")
  );

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div>
      {/* Простий navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/">Cars</Link>
          <Link to="/users">Users</Link>
          <Link to="/maintenance">Maintenance</Link>
        </div>

        <div className="navbar-right">
          {isLoggedIn ? (
            <button className="btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </nav>

      {/* Основний контент */}
      <main>
        <Routes>
          <Route path="/" element={<CarsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route
            path="/login"
            element={<LoginPage onLogin={handleLogin} />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
