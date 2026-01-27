// client/src/components/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const registered = location.state?.registered;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login", form);
      login(res.data.user, res.data.accessToken);
      navigate("/");
    } catch {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h1>Login</h1>

        {registered && (
          <p role="status" className="success">
            Account created! Please log in.
          </p>
        )}

        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="form" noValidate>
          <label htmlFor="usernameOrEmail">Email or Username</label>
          <input
            id="usernameOrEmail"
            value={form.usernameOrEmail}
            onChange={handleChange}
            autoComplete="username"
            required
          />

          <label htmlFor="password">Password</label>
          <div className="password-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="eye-button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              👁️
            </button>
          </div>

          <button type="submit">Login</button>
        </form>

        <p className="helper-text">
          Don’t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}
