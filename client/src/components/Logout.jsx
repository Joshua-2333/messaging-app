// client/src/components/Logout.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Logout() {
  const { logout } = useAuth();
  const { showToast } = useToast();

  const handleLogout = () => {
    logout();
    showToast("You have been logged out", "success");
  };

  return (
    <button
      className="logout-btn"
      onClick={handleLogout}
      type="button"
      aria-label="Logout"
    >
      Logout
    </button>
  );
}
