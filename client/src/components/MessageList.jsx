// client/src/components/MessageList.jsx
import React from "react";

export default function MessageList({ messages, currentUser }) {
  return (
    <div className="message-list" role="log" aria-live="polite">
      {messages.length === 0 && (
        <div className="empty-state">
          <h3>No messages yet</h3>
        </div>
      )}

      {messages.map((m) => {
        const isSelf = m.sender_id === currentUser;

        return (
          <div
            key={m.id}
            className={`message-item ${isSelf ? "self" : "other"}`}
          >
            <div className="message-content">{m.content}</div>

            <time className="message-time">
              {new Date(m.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </div>
        );
      })}
    </div>
  );
}
