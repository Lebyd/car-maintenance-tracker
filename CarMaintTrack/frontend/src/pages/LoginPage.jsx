import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);

  const navigate = useNavigate();

  const handleRequestOtp = async () => {
    setError("");
    setInfo("");

    if (!email.trim()) {
      setError("Please enter your email first.");
      return;
    }

    try {
      setLoadingOtp(true);
      const res = await apiClient.post("/auth/request-otp", { email });
      setInfo(
        res.data?.message ||
          "OTP has been sent to your email. Please check your inbox."
      );
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Failed to request OTP. Please check the email.";
      setError(msg);
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!email.trim() || !password.trim() || !otp.trim()) {
      setError("Please fill in email, password, and OTP.");
      return;
    }

    try {
      setLoadingLogin(true);

      const res = await apiClient.post("/auth/login", {
        email,
        password,
        otp,
      });

      const token = res.data?.token;
      if (!token) {
        setError("Login failed: no token received.");
        setLoadingLogin(false);
        return;
      }

      // Save token so axios interceptor can use it
      localStorage.setItem("authToken", token);

      if (onLogin) {
        onLogin();
      }

      setInfo("Login successful!");
      // Optionally redirect to home / cars page
      navigate("/");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Login failed. Please check your credentials and OTP.";
      setError(msg);
    } finally {
      setLoadingLogin(false);
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {info && <div className="alert alert-success">{info}</div>}

      <section className="card">
        <h2>Sign in with Email, Password & OTP</h2>
        <p style={{ marginBottom: "0.75rem" }}>
          Step 1: Enter your email and click <strong>Request OTP</strong>. The
          code will be sent to your email. <br />
          Step 2: Enter your password and the OTP, then click{" "}
          <strong>Login</strong>.
        </p>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>
              Email:
              <input
                type="email"
                value={email}
                placeholder="your.email@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="Your password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              OTP:
              <input
                type="text"
                value={otp}
                placeholder="6-digit code from email"
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </label>
          </div>

          <div className="form-group" style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleRequestOtp}
              disabled={loadingOtp || !email.trim()}
            >
              {loadingOtp ? "Requesting OTP..." : "Request OTP"}
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={loadingLogin}
            >
              {loadingLogin ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default LoginPage;
