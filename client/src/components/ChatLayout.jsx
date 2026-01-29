// client/src/components/ChatLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import ConversationList from "./ConversationList";
import ThemeToggle from "./ThemeToggle";
import Logout from "./Logout";
import MobileNav from "./MobileNav";
import ChatHeader from "./ChatHeader";

export default function ChatLayout() {
  return (
    <div className="chat-layout">
      {/* Sidebar */}
      <aside className="chat-sidebar" aria-label="Conversation list">
        <header className="sidebar-header">
          <h2 className="sidebar-title">Messages</h2>
          <div className="sidebar-actions">
            <ThemeToggle />
            <Logout />
          </div>
        </header>

        <nav aria-label="Conversations">
          <ConversationList />
        </nav>
      </aside>

      {/* Main chat area */}
      <main className="chat-main" role="main">
        <ChatHeader />
        <section className="chat-panel" aria-label="Message feed" role="region">
          <Outlet />
        </section>
      </main>

      {/* Mobile navigation (hidden on desktop) */}
      <MobileNav />
    </div>
  );
}
