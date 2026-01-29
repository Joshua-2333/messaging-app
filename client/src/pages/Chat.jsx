// client/src/pages/Chat.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import MessageList from "../components/MessageList";
import { useAuth } from "../context/AuthContext";

export default function Chat() {
  const { conversationId } = useParams();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  const loadMessages = async (pageNum = 1) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await API.get(`/messages/${conversationId}?page=${pageNum}`);
      setMessages((prev) =>
        pageNum === 1 ? res.data.messages : [...res.data.messages, ...prev]
      );
      setHasMore(res.data.hasMore);
      setPage(pageNum);
    } catch (err) {
      console.error("Error loading messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMessages([]);
    setPage(1);
    loadMessages(1);
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    API.patch(`/messages/${conversationId}/read`).catch(() => {});
  }, [conversationId]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    const payload = text;
    setText("");
    try {
      await API.post("/messages", {
        conversation_id: conversationId,
        content: payload,
      });
      loadMessages(1);
    } catch {
      setText(payload);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-main">
      <header className="chat-header">
        <h2 className="chat-title">Conversation</h2>
      </header>

      <div className="chat-panel" role="log" aria-live="polite">
        {hasMore && (
          <button
            className="load-more"
            onClick={() => loadMessages(page + 1)}
            disabled={loading}
          >
            Load older messages
          </button>
        )}

        <MessageList messages={messages} currentUser={user?.id} />
        <div ref={bottomRef} />
      </div>

      <form
        className="message-input"
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
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          rows={1}
          aria-label="Message input"
        />
        <button type="submit" disabled={!text.trim()} aria-label="Send message">
          Send
        </button>
      </form>
    </div>
  );
}
