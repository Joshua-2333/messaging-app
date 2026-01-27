// client/src/components/MessageList.jsx
import React from "react";

export default function MessageList({ messages }) {
  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>
          <strong>{m.sender_id}</strong>: {m.content}
          <small> {new Date(m.created_at).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}
