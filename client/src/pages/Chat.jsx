// client/src/pages/Chat.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MessageList from "../components/MessageList";
import { mockConversations, mockMessages } from "../mockData/messages";

// Map conversation/user IDs to icons
const ICONS = {
  c1: "/vivi-icon.png",   // Alice
  c2: "/Majora.jpg",      // Bob
  c3: "/BG3.png",         // Game Night
};

export default function Chat() {
  const { conversationId } = useParams();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  // Load messages
  useEffect(() => {
    const convoMessages = mockMessages.filter(
      (m) => m.conversationId === conversationId
    );
    setMessages(convoMessages);
  }, [conversationId]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-expand textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const resize = () => {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    };

    textarea.addEventListener("input", resize);
    resize();

    return () => textarea.removeEventListener("input", resize);
  }, []);

  const sendMessage = () => {
    if (!text.trim()) return;

    const newMessage = {
      id: "m" + Date.now(),
      conversationId,
      sender: user?.id || "me",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const conversation = mockConversations.find(
    (c) => c.id === conversationId
  );

  return (
    <div className="chat-content">
      {/* Header with icon */}
      {conversation && (
        <header className="chat-header" role="banner">
          <div className="chat-header-info">
            <img
              src={ICONS[conversation.id]}
              alt={`${conversation.name} icon`}
              className="chat-header-icon"
            />
            <h2 className="chat-title">{conversation.name}</h2>
          </div>
        </header>
      )}

      {/* Messages */}
      <div className="messages-scroll" role="log" aria-live="polite">
        <MessageList
          messages={messages}
          currentUser={user?.id || "me"}
          isGroup={conversation?.type === "group"}
          iconsMap={ICONS}
        />
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        className="chat-input"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <label htmlFor="message-input" className="sr-only">
          Type your message
        </label>

        <textarea
          id="message-input"
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          rows={1}
          aria-label="Message input"
        />

        <button
          type="submit"
          disabled={!text.trim()}
          aria-label="Send message"
        >
          Send
        </button>
      </form>
    </div>
  );
}
