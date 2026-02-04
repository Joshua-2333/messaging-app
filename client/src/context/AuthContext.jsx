// client/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import API from "../api.js";

const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(Cookies.get("token") || null);

  // Load saved user from cookie on mount
  useEffect(() => {
    const savedUser = Cookies.get("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed?.id && parsed?.username) setUser(parsed);
        else {
          Cookies.remove("user");
          Cookies.remove("token");
        }
      } catch {
        Cookies.remove("user");
        Cookies.remove("token");
      }
    }
  }, []);

  // REFRESH user whenever token changes
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    API.get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setUser(res.data);
        Cookies.set("user", JSON.stringify(res.data));
      })
      .catch((err) => {
        console.error("Failed to fetch user data:", err);
        setUser(null);
        Cookies.remove("user");
        Cookies.remove("token");
      });
  }, [token]);

  const login = (userData, jwtToken, remember = false) => {
    if (!userData?.id || !userData?.username) return;

    setUser(userData);
    setToken(jwtToken);

    const options = remember ? { expires: 7 } : undefined;
    Cookies.set("token", jwtToken, options);
    Cookies.set("user", JSON.stringify(userData), options);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    Cookies.remove("token");
    Cookies.remove("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
