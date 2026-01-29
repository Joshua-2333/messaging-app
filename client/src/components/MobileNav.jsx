// client/src/components/MobileNav.jsx
import React from "react";
import { NavLink } from "react-router-dom";

export default function MobileNav() {
  return (
    <nav
      className="mobile-nav"
      aria-label="Primary navigation"
    >
      <NavLink to="/" end>
        <span className="material-symbols-outlined">home</span>
        <span className="nav-label">Home</span>
      </NavLink>

      <NavLink to="/profile">
        <span className="material-symbols-outlined">person</span>
        <span className="nav-label">Profile</span>
      </NavLink>
    </nav>
  );
}
