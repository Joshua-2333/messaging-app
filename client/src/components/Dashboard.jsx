// client/src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import API from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

import ChatWindow from "./ChatWindow.jsx";
import Logout from "./Logout.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import UserList from "./UserList.jsx";

export default function Dashboard() {
  const { user, token } = useAuth();

  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  // Store messages per chat id to persist them across switches
  const [messagesByChat, setMessagesByChat] = useState({});

  /*Fetch groups*/
  useEffect(() => {
    if (!token) return;
    API.get("/groups", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setGroups(res.data))
      .catch(console.error);
  }, [token]);

  /*Fetch users*/
  useEffect(() => {
    if (!token || !user) return;
    API.get("/users", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUsers(res.data.filter((u) => u.id !== user.id)))
      .catch(console.error);
  }, [token, user]);

  /*Fetch messages for selected chat*/
  useEffect(() => {
    if (!selectedChat || !token) return;

    const chatKey = `${selectedChat.type}-${selectedChat.data.id}`;

    // Only fetch if we don't already have messages for this chat
    if (messagesByChat[chatKey]?.length > 0) return;

    const fetchMessages = async () => {
      try {
        const endpoint =
          selectedChat.type === "group"
            ? `/messages/${selectedChat.data.id}`
            : `/messages/dm/${selectedChat.data.id}`;

        const res = await API.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMessagesByChat((prev) => ({
          ...prev,
          [chatKey]: res.data,
        }));
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setMessagesByChat((prev) => ({
          ...prev,
          [chatKey]: [],
        }));
      }
    };

    fetchMessages();
  }, [selectedChat, token, messagesByChat]);

  /*Handle chat selection*/
  const handleGroupSelect = (group) =>
    setSelectedChat({ type: "group", data: group });
  const handleUserSelect = (dmUser) =>
    setSelectedChat({ type: "dm", data: dmUser });

  /*Send message handler*/
  const handleNewMessage = (newMsg) => {
    if (!selectedChat) return;
    const chatKey = `${selectedChat.type}-${selectedChat.data.id}`;
    setMessagesByChat((prev) => ({
      ...prev,
      [chatKey]: [...(prev[chatKey] || []), newMsg],
    }));
  };

  if (!user) return <p className="loading">Loading dashboard…</p>;

  const currentChatKey =
    selectedChat && `${selectedChat.type}-${selectedChat.data.id}`;
  const currentMessages = currentChatKey
    ? messagesByChat[currentChatKey] || []
    : [];

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
                    selectedChat?.type === "group" &&
                    selectedChat.data.id === group.id
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
          <UserList
            users={users}
            selectedChat={selectedChat}
            onSelect={handleUserSelect}
          />
        </aside>

        <main className="chat-window">
          {selectedChat ? (
            <ChatWindow
              chat={selectedChat}
              currentUser={user}
              messages={currentMessages}
              setMessages={handleNewMessage} // persist per chat
            />
          ) : (
            <p>Select a group or user to start chatting</p>
          )}
        </main>
      </div>
    </div>
  );
}
