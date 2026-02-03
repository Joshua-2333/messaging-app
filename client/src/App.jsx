// client/src/App.jsx
import React, { useState, createContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

// Theme context
export const ThemeContext = createContext();

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [theme, setTheme] = useState("light");

  // Toggle theme
  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // Apply theme class to body so CSS variables work globally
  useEffect(() => {
    document.body.className = theme; // sets 'light' or 'dark' on body
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <div className="app">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeContext.Provider>
  );
}
