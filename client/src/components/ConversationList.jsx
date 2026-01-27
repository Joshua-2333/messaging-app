// client/src/components/ConversationList.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function ConversationList({ conversations }) {
  return (
    <div>
      {conversations.map((c) => (
        <Link key={c.conversation_id} to={`/chat/${c.conversation_id}`}>
          <div>
            <h3>{c.other_user.username}</h3>
            <p>Unread: {c.unread_count}</p>
            <p>Last: {c.last_message || "No messages yet"}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
