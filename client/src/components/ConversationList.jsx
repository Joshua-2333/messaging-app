// client/src/components/ConversationList.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api/api";

export default function ConversationList() {
  const [conversations, setConversations] = useState([]);
  const { conversationId } = useParams();

  useEffect(() => {
    API.get("/conversations")
      .then((res) => setConversations(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="conversation-list">
      {conversations.map((c) => (
        <Link
          key={c.conversation_id}
          to={`/chat/${c.conversation_id}`}
          className={`conversation-item ${
            Number(conversationId) === c.conversation_id ? "active" : ""
          }`}
        >
          <h3>{c.other_user.username}</h3>
          <p className="muted">{c.last_message || "No messages yet"}</p>
          {c.unread_count > 0 && <span className="badge">{c.unread_count}</span>}
        </Link>
      ))}
    </div>
  );
}
