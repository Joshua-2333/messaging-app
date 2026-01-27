// client/src/components/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await API.post("/auth/register", {
        username,
        password,
        display_name: displayName,
      });

      const token = res.data.token;
      const user = res.data.user;

      login(user, token);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div>
      <h1>Register</h1>

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

      <input
        placeholder="Display name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />

      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
