// client/src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import API from "../api/api";
import ConversationList from "../components/ConversationList";
import { useAuth } from "../context/AuthContext";
import Logout from "../components/Logout";

export default function Home() {
  const [conversations, setConversations] = useState([]);
  const { logout, user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    API.get("/conversations")
      .then((res) => {
        if (isMounted) {
          setConversations(res.data);
        }
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          logout();
        }
      });

    return () => {
      isMounted = false;
    };
  }, [logout]);

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="home-header-left">
          <h1>
            Welcome{user?.username ? `, ${user.username}` : ""}!
          </h1>
        </div>

        <div className="home-header-right">
          <Logout />
        </div>
      </header>

      <main className="home-content">
        <section aria-labelledby="conversations-heading">
          <h2 id="conversations-heading">Conversations</h2>
          <ConversationList conversations={conversations} />
        </section>
      </main>
    </div>
  );
}
