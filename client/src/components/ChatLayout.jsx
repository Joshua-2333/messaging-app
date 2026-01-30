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

        {/* Conversation list */}
        <nav className="sidebar-scroll" aria-label="Conversations">
          <ConversationList />
        </nav>
      </aside>

      {/* Main chat area */}
      <main className="chat-main" role="main">
        {/* Chat header */}
        <ChatHeader />

        {/* Outlet renders Chat.jsx */}
        <div className="chat-outlet">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <MobileNav />
    </div>
  );
}
