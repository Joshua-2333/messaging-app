// client/src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import API from "../api.js";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const registered = location.state?.registered;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    setError({ ...error, [e.target.id]: "", general: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newError = {};

    if (!form.usernameOrEmail.trim()) newError.usernameOrEmail = "Username or Email is required.";
    if (!form.password.trim()) newError.password = "Password is required.";

    if (Object.keys(newError).length > 0) {
      setError(newError);
      return;
    }

    try {
      const res = await API.post("/auth/login", {
        usernameOrEmail: form.usernameOrEmail,
        password: form.password,
      });

      const user = res.data.user;
      const token = res.data.token;

      login(user, token, rememberMe);

      navigate("/");
    } catch (err) {
      setError({
        general: err.response?.data?.message || "Invalid username/email or password.",
      });
    }
  };

  return (
    <div className="app">
      <div className={`card ${error.general ? "shake" : ""}`} role="form" aria-labelledby="login-title">
        <h1 id="login-title">Login</h1>

        {registered && <p role="status" className="success">Account created! Please log in.</p>}
        {error.general && <p role="alert" className="error">{error.general}</p>}

        <form onSubmit={handleSubmit} className="form" noValidate>
          <label htmlFor="usernameOrEmail">Username or Email</label>
          <input
            id="usernameOrEmail"
            value={form.usernameOrEmail}
            onChange={handleChange}
            autoComplete="username"
            aria-invalid={!!error.usernameOrEmail}
            aria-describedby={error.usernameOrEmail ? "username-error" : undefined}
          />
          {error.usernameOrEmail && <p id="username-error" role="alert" className="error">{error.usernameOrEmail}</p>}

          <label htmlFor="password">Password</label>
          <div className="password-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              aria-invalid={!!error.password}
              aria-describedby={error.password ? "password-error" : undefined}
            />
            <button type="button" className="eye-button" onClick={() => setShowPassword(prev => !prev)}>
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {error.password && <p id="password-error" role="alert" className="error">{error.password}</p>}

          <label className="remember-me">
            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
            Remember Me
          </label>

          <button type="submit">Login</button>
        </form>

        <p className="helper-text">
          Don’t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}
