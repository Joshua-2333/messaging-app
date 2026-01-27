// client/src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import API from "../api/api";
import ConversationList from "../components/ConversationList";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const [conversations, setConversations] = useState([]);
  const { logout } = useAuth();

  useEffect(() => {
    API.get("/conversations")
      .then((res) => setConversations(res.data))
      .catch((err) => {
        if (err.response?.status === 401) {
          logout();
        }
      });
  }, [logout]);

  return (
    <div>
      <h1>Conversations</h1>
      <ConversationList conversations={conversations} />
    </div>
  );
}
