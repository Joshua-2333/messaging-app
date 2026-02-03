// client/src/components/ThemeToggle.jsx
import React, { useContext } from "react";
import { ThemeContext } from "../App";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span className="material-symbols-outlined" aria-hidden="true">
        {isDark ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}
