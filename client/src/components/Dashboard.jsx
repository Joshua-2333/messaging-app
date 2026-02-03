// client/src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import API from "../api.js";
import { useAuth } from "../context/AuthContext";

import ChatWindow from "./ChatWindow";
import Logout from "./Logout";
import ThemeToggle from "./ThemeToggle";

export default function Dashboard() {
  const { user, token } = useAuth();

  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);

  /* ------------------ Fetch groups ------------------ */
  useEffect(() => {
    if (!token) return;
    API.get("/groups", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setGroups(res.data))
      .catch(console.error);
  }, [token]);

  /* ------------------ Fetch users ------------------ */
  useEffect(() => {
    if (!token || !user) return;
    API.get("/users", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUsers(res.data.filter((u) => u.id !== user.id)))
      .catch(console.error);
  }, [token, user]);

  /* ------------------ Fetch messages ------------------ */
  useEffect(() => {
    if (!selectedChat || !token) return;

    const endpoint =
      selectedChat.type === "group"
        ? `/messages/${selectedChat.data.id}`
        : `/messages/dm/${selectedChat.data.id}`;

    API.get(endpoint, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setMessages(res.data))
      .catch(console.error);
  }, [selectedChat, token]);

  const handleGroupSelect = (group) => setSelectedChat({ type: "group", data: group });
  const handleUserSelect = (dmUser) => setSelectedChat({ type: "dm", data: dmUser });

  if (!user) return <p className="loading">Loading dashboard…</p>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h2>Welcome, {user.username}</h2>
        <div className="header-controls">
          <ThemeToggle />
          <Logout />
        </div>
      </header>

      <div className="dashboard-body">
        <aside className="sidebar">
          {/* GROUPS */}
          <div className="group-list-container">
            <h4>Groups</h4>
            <ul>
              {groups.map((group) => (
                <li
                  key={group.id}
                  className={
                    selectedChat?.type === "group" && selectedChat.data.id === group.id
                      ? "selected"
                      : ""
                  }
                  onClick={() => handleGroupSelect(group)}
                >
                  <img
                    className="group-avatar"
                    src={group.avatar || "/default-group.png"}
                    alt={group.name}
                  />
                  {group.name}
                </li>
              ))}
            </ul>
          </div>

          {/* USERS */}
          <div className="user-list-container">
            <h4>Users</h4>
            <ul>
              {users.map((u) => (
                <li
                  key={u.id}
                  className={
                    selectedChat?.type === "dm" && selectedChat.data.id === u.id
                      ? "selected"
                      : ""
                  }
                  onClick={() => handleUserSelect(u)}
                >
                  <img
                    className="user-avatar"
                    src={u.avatar || "/vivi-icon.png"}
                    alt={u.username}
                  />
                  {u.username}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="chat-window">
          {selectedChat ? (
            <ChatWindow
              messages={messages}
              setMessages={setMessages}
              chat={selectedChat}
              currentUser={user}
            />
          ) : (
            <p>Select a group or user to start chatting</p>
          )}
        </main>
      </div>
    </div>
  );
}
