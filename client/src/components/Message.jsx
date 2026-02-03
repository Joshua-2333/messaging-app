// client/src/components/Message.jsx
import React from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Message({ message, isOwn }) {
  const { user } = useAuth();

  const avatarSrc = isOwn ? user?.avatar || "/Aqua.png" : message.avatar || "/Aqua.png";

  return (
    <div className={`message ${isOwn ? "own-message" : ""}`}>
      {avatarSrc && (
        <img
          src={avatarSrc}
          alt={isOwn ? "You" : message.username}
          className="avatar"
        />
      )}
      <div className="message-content">
        {!isOwn && <span className="username">{message.username}</span>}
        <p>{message.content}</p>
        <small>{new Date(message.created_at).toLocaleTimeString()}</small>
      </div>
    </div>
  );
}
