// client/src/components/ChatWindow.jsx
import React, { useState } from "react";
import API from "../api.js";
import { useAuth } from "../context/AuthContext";
import Message from "./Message";

export default function ChatWindow({ messages = [], setMessages, chat, currentUser }) {
  const { token } = useAuth();
  const [newMessage, setNewMessage] = useState("");

  if (!chat || !currentUser?.id) return <p>Select a chat to start messaging</p>;

  const chatName =
    chat.type === "group" ? chat.data.name : chat.data.username;

  const chatId = chat.data.id;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const payload =
        chat.type === "group"
          ? { group_id: chatId, content: newMessage }
          : { recipient_id: chatId, content: newMessage };

      const res = await API.post("/messages", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update messages immediately
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="chat-window-container">
      <h3>{chatName}</h3>

      <div className="messages-list">
        {messages.map((msg) => {
          const sender =
            msg.sender_id === currentUser.id
              ? currentUser
              : chat.type === "dm"
              ? chat.data
              : { username: msg.username, avatar: msg.avatar };

          return (
            <Message
              key={msg.id}
              message={{ ...msg, username: sender.username, avatar: sender.avatar }}
              isOwn={msg.sender_id === currentUser.id}
            />
          );
        })}
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
