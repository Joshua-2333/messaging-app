// client/src/components/Message.jsx
import React from "react";

export default function Message({ message, isOwn }) {
  return (
    <div className={`message ${isOwn ? "own-message" : ""}`}>
      {!isOwn && message.avatar && (
        <img src={message.avatar} alt={message.username} className="avatar" />
      )}
      <div className="message-content">
        {!isOwn && <span className="username">{message.username}</span>}
        <p>{message.content}</p>
        <small>{new Date(message.created_at).toLocaleTimeString()}</small>
      </div>
    </div>
  );
}
