// client/src/components/MobileNav.jsx
import React, { useState } from "react";
import ConversationList from "./ConversationList";

export default function MobileNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  return (
    <>
      {/* Bottom navigation bar */}
      <nav className="mobile-nav" aria-label="Primary mobile navigation">
        <button
          onClick={toggleDrawer}
          aria-expanded={drawerOpen}
          aria-controls="mobile-drawer"
        >
          Conversations
        </button>
      </nav>

      {/* Sliding drawer */}
      <aside
        id="mobile-drawer"
        className={`mobile-drawer ${drawerOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
      >
        <header className="drawer-header">
          <h2>Conversations</h2>
          <button onClick={toggleDrawer} aria-label="Close drawer">
            ✕
          </button>
        </header>
        <div className="drawer-body">
          <ConversationList />
        </div>
      </aside>

      {/* Overlay */}
      {drawerOpen && <div className="drawer-overlay" onClick={toggleDrawer} />}
    </>
  );
}
