// client/src/pages/Home.jsx
import React, { useEffect, useState, useRef } from "react";
import API from "../api/api";
import ConversationList from "../components/ConversationList";
import { useAuth } from "../context/AuthContext";
import Logout from "../components/Logout";
import ThemeToggle from "../components/ThemeToggle";
import NewConversationModal from "../components/NewConversationModal";

export default function Home() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const { logout, user } = useAuth();

  const contentRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    setLoading(true);

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
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);

          // move focus to content once loaded (accessibility)
          requestAnimationFrame(() => {
            contentRef.current?.focus();
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [logout]);

  return (
    <div className="home-container">
      {/*HEADER*/}
      <header className="home-header sticky-header">
        <h1>
          Welcome{user?.username ? `, ${user.username}` : ""}!
        </h1>

        <div className="header-actions">
          <ThemeToggle />
          <Logout />
        </div>
      </header>

      {/*MAIN*/}
      <main className="home-content">
        <section aria-labelledby="conversations-heading">
          <h2 id="conversations-heading">Conversations</h2>

          {/*Skeleton loaders*/}
          {loading && (
            <div
              className="conversation-list"
              aria-busy="true"
              aria-live="polite"
            >
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="conversation-skeleton skeleton"
                  aria-hidden="true"
                />
              ))}
            </div>
          )}

          {/*Empty state*/}
          {!loading && conversations.length === 0 && (
            <div className="empty-state" role="status">
              <h3>No conversations yet</h3>
              <p>Start a new conversation to begin chatting.</p>

              <button
                className="primary-btn"
                onClick={() => setModalOpen(true)}
              >
                New Conversation
              </button>
            </div>
          )}

          {/*Conversations*/}
          {!loading && conversations.length > 0 && (
            <div
              ref={contentRef}
              className="fade-in"
              tabIndex={-1}
            >
              <ConversationList conversations={conversations} />
            </div>
          )}
        </section>
      </main>

      {/*MODAL*/}
      <NewConversationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
