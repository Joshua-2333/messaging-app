// client/src/components/ChatWindow.jsx
import React, { useState, useEffect, useRef } from "react";
import API from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import Message from "./Message.jsx";

export default function ChatWindow({ chat, currentUser, messages, setMessages }) {
  const { token } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const payload =
        chat.type === "group"
          ? { group_id: chat.data.id, content: newMessage }
          : { recipient_id: chat.data.id, content: newMessage };

      const res = await API.post("/messages", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Persist message per chat
      setMessages(res.data);

      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  if (!chat || !currentUser?.id) return <p>Select a chat to start messaging</p>;

  const chatName = chat.type === "group" ? chat.data.name : chat.data.username;

  return (
    <div className="chat-window-container">
      <h3>{chatName}</h3>

      <div className="messages-list">
        {messages.map((msg) => {
          const sender =
            msg.sender_id === currentUser.id
              ? { username: currentUser.username, avatar: currentUser.avatar || "/Aqua.png" }
              : chat.type === "dm"
              ? { username: chat.data.username, avatar: chat.data.avatar || "/Aqua.png" }
              : { username: msg.username || "Unknown", avatar: msg.avatar || "/Aqua.png" };

          return (
            <Message
              key={msg.id}
              message={{ ...msg, username: sender.username, avatar: sender.avatar }}
              isOwn={msg.sender_id === currentUser.id}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="chat-input-form">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
