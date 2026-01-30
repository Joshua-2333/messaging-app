// client/src/components/MessageList.jsx
import React, { useEffect, useRef } from "react";
import { userAvatars } from "../mockData/chatData";

/**
 * MessageList Component
 * Renders a list of messages for a conversation.
 *
 * Props:
 * - messages: array of message objects (from chatData.messages or backend)
 * - currentUser: string (e.g., "me")
 * - isGroup: boolean (true if group chat)
 */
export default function MessageList({ messages, currentUser = "me", isGroup = false }) {
  const messageRefs = useRef([]);

  // Animate unread messages
  useEffect(() => {
    messages.forEach((msg, i) => {
      if (!msg.read) {
        const el = messageRefs.current[i];
        if (el) {
          el.classList.add("unread-flash");
          setTimeout(() => {
            el.classList.remove("unread-flash");
          }, 1200);
        }
      }
    });
  }, [messages]);

  return (
    <div className="message-list" role="log" aria-live="polite">
      {messages.length === 0 && (
        <div className="empty-state">
          <h3>No messages yet</h3>
        </div>
      )}

      {messages.map((m, i) => {
        const isSelf = m.sender === currentUser;

        // ✅ Determine avatar: use m.avatar if exists, else fallback to userAvatars
        const avatarSrc = m.avatar || userAvatars[m.sender] || "/Aqua.png";

        return (
          <div
            key={m.id}
            ref={(el) => (messageRefs.current[i] = el)}
            className={`message-item ${isSelf ? "self" : "other"}`}
          >
            {/* Avatar: show only for other users */}
            {!isSelf && (
              <img
                src={avatarSrc}
                alt={`${m.sender} avatar`}
                className="message-sender-icon"
              />
            )}

            <div className="message-content-wrapper">
              {/* Show sender name in group chats */}
              {isGroup && (
                <div className="message-sender">
                  {isSelf ? "Me" : m.sender}
                </div>
              )}

              <div className="message-content">{m.content}</div>

              <time className="message-time">
                {new Date(m.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            </div>
          </div>
        );
      })}
    </div>
  );
}
