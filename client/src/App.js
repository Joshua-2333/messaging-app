// client/src/App.js
import { useEffect, useState, createContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import ChatLayout from "./components/ChatLayout";
import Chat from "./pages/Chat";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";

export const ThemeContext = createContext();

// Load theme from localStorage or default to light
function getInitialTheme() {
  return localStorage.getItem("theme") || "light";
}

// ProtectedRoute wrapper
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p style={{ textAlign: "center", marginTop: 50 }}>Loading...</p>;
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  const { user, loading } = useAuth();
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  if (loading) return null;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/chat" replace />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/chat" replace />} />

        {/* Chat layout */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatLayout />
            </ProtectedRoute>
          }
        >
          <Route path=":conversationId" element={<Chat />} />
        </Route>

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/chat/1" replace />} />
      </Routes>
    </ThemeContext.Provider>
  );
}

export default App;
