// client/src/components/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { username, password });

      const token = res.data.token; // must match backend
      const user = res.data.user;

      login(user, token);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <div style={{ position: "relative" }}>
        <input
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Eye icon */}
        <span
          style={{
            position: "absolute",
            right: "10px",
            top: "10px",
            cursor: "pointer",
            fontSize: "20px",
          }}
          onClick={() => setShowPassword(!showPassword)}
        >
          👁️
        </span>
      </div>

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
