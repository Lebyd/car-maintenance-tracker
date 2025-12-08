import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const res = await apiClient.post("/auth/login", {
        email,
        password,
      });

      const token = res.data?.token;
      if (!token) {
        setError("Login failed: no token received.");
        setLoading(false);
        return;
      }

      // Save token
      localStorage.setItem("authToken", token);

      // Notify parent (App) that login was successful
      if (onLogin) {
        onLogin();
      }

      // Redirect to cars page
      navigate("/");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <section className="card">
        <h2>Sign in to your account</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Your password"
              />
            </label>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default LoginPage;
