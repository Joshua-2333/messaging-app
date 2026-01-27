// client/src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import API from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [loading, setLoading] = useState(true);

  // Set Axios auth header
  const setAuthHeader = (token) => {
    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete API.defaults.headers.common["Authorization"];
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(storedUser);
      setAuthHeader(token);
    } else {
      setUser(null);
      setAuthHeader(null);
    }

    setLoading(false);
  }, []);

  const login = (user, token, refreshToken) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);

    setAuthHeader(token);
    setUser(user);
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    // Try to logout from backend
    try {
      await API.post("/auth/logout", { refreshToken });
    } catch (err) {
      console.warn("Logout failed on backend:", err);
    }

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    setAuthHeader(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
