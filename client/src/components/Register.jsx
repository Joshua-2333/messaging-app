// client/src/components/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api.js"; // <- fixed import

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const newErrors = {};
    if (form.username.trim().length < 3) newErrors.username = "Username must be at least 3 characters.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(form.email)) newErrors.email = "Please enter a valid email address.";
    const passwordRegex = /^(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(form.password))
      newErrors.password = "Password must be at least 6 characters and include one capital letter.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => setForm({ ...form, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    try {
      await API.post("/auth/register", form);
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h1>Create Account</h1>
        {serverError && <p role="alert" className="error">{serverError}</p>}

        <form onSubmit={handleSubmit} className="form" noValidate>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
            required
            aria-invalid={!!errors.username}
          />
          {errors.username && <p className="error">{errors.username}</p>}

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <label htmlFor="password">Password</label>
          <div className="password-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
              aria-invalid={!!errors.password}
            />
            <button
              type="button"
              className="eye-button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <span className="material-symbols-outlined">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
          {errors.password && <p className="error">{errors.password}</p>}

          <button type="submit">Sign up</button>
        </form>

        <p className="helper-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
