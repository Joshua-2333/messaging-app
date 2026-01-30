// client/src/components/ConversationList.jsx
import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { conversations, messages } from "../mockData/chatData";

/**
 * Truncate a string to a max length (adds "..." if too long)
 */
function truncate(text, max = 40) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "..." : text;
}

export default function ConversationList() {
  const { conversationId } = useParams();

  return (
    <aside className="conversation-sidebar" aria-label="Conversation list">
      <h2 className="sidebar-title">Chats</h2>

      <ul className="conversation-list">
        {conversations.map((c) => {
          const isActive = conversationId === c.id;

          // Find the latest message for this conversation
          const convoMessages = messages
            .filter((m) => m.conversationId === c.id)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          const latestMessage = convoMessages[0]?.content || "No messages yet";

          return (
            <li key={c.id}>
              <NavLink
                to={`/chat/${c.id}`}
                className={`conversation-item ${isActive ? "active" : ""}`}
                aria-current={isActive ? "true" : undefined}
              >
                {/* Avatar/icon from conversation data */}
                <img
                  src={c.icon || "/Aqua.png"}
                  alt={`${c.name} avatar`}
                  className="conversation-avatar"
                />

                {/* Conversation text */}
                <div className="conversation-meta">
                  <h3 className="conversation-name">{c.name}</h3>
                  <p className="conversation-preview">
                    {truncate(latestMessage, 40)}
                  </p>
                </div>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
