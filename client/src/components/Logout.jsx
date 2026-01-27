// client/src/components/Logout.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Logout() {
  const { logout } = useAuth();

  return (
    <button className="logout-button" onClick={logout}>
      Logout
    </button>
  );
}
