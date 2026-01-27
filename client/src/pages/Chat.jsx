// client/src/pages/Chat.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import MessageList from "../components/MessageList";
import { useAuth } from "../context/AuthContext";

export default function Chat() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const { user } = useAuth();

  const loadMessages = (pageNum = 1) => {
    API.get(`/messages/${id}?page=${pageNum}`)
      .then((res) => {
        setMessages((prev) => [...res.data.messages, ...prev]);
        setHasMore(res.data.hasMore);
      });
  };

  useEffect(() => {
    loadMessages(1);
  }, [id]);

  const sendMessage = () => {
    if (!text.trim()) return;

    API.post("/messages", { conversation_id: id, content: text })
      .then(() => {
        setText("");
        loadMessages(1);
      });
  };

  const markRead = () => {
    API.patch(`/messages/${id}/read`);
  };

  useEffect(() => {
    markRead();
  }, [id]);

  return (
    <div>
      <h1>Chat</h1>

      {hasMore && (
        <button onClick={() => loadMessages(page + 1)}>Load More</button>
      )}

      <MessageList messages={messages} />

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
