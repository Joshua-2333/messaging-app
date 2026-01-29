// client/src/components/Dashboard.jsx
import React from "react";

export default function Dashboard() {
  return (
    <div className="app" style={{ flexDirection: "column" }}>
      <h1>Dashboard</h1>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
        marginTop: "20px"
      }}>
        <div className="card">Profile</div>
        <div className="card">Messages</div>
        <div className="card">Settings</div>
        <div className="card">Analytics</div>
      </div>
    </div>
  );
}
