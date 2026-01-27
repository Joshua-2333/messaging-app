// client/src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [loading, setLoading] = useState(true);

  // --- Set Authorization header ---
  const setAuthHeader = (token) => {
    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete API.defaults.headers.common["Authorization"];
    }
  };

  // --- AUTO REFRESH TOKEN ON PAGE LOAD ---
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      // User already in localStorage
      setUser(storedUser);
      setAuthHeader(token);
      setLoading(false);
    } else {
      // Try refresh token from cookie
      API.post("/token/refresh", {}, { withCredentials: true })
        .then((res) => {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          localStorage.setItem("token", res.data.accessToken);
          setUser(res.data.user);
          setAuthHeader(res.data.accessToken);
        })
        .catch(() => {
          // Refresh failed
          setUser(null);
          setAuthHeader(null);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  // --- LOGIN ---
  const login = (user, token, remember = true) => {
    // Store in localStorage
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);

    // "Remember Me" handled server-side with cookie maxAge
    setAuthHeader(token);
    setUser(user);
  };

  // --- LOGOUT ---
  const logout = async () => {
    try {
      await API.post("/auth/logout"); // clears refresh cookie server-side
    } catch (err) {
      console.warn("Logout failed on backend:", err);
    }

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setAuthHeader(null);
    setUser(null);

    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// --- Hook for easy usage ---
export const useAuth = () => useContext(AuthContext);
