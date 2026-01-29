// client/src/components/MessageInput.jsx
import React, { useState } from "react";

export default function MessageInput({ onSend }) {
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) return;

    if (onSend) onSend(message);
    setMessage("");
  }

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <label htmlFor="message" className="sr-only">
        Message input
      </label>
      <input
        id="message"
        type="text"
        placeholder="Type a message…"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
