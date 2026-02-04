// client/src/components/UserList.jsx
import React from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function UserList({ users = [], selectedChat, onSelect }) {
  const { user } = useAuth();
  if (!user || !user.id) return null;

  // Only core users
  const coreUsernames = ["Alice", "Kyle", "Sophie", "Dan"];
  const visibleUsers = users.filter(
    u => coreUsernames.includes(u.username) && u.id !== user.id
  );

  return (
    <div className="user-list-container">
      <h4>Users</h4>
      <ul>
        {visibleUsers.map(u => (
          <li
            key={u.id}
            className={
              selectedChat?.type === "dm" && selectedChat.data?.id === u.id
                ? "selected"
                : ""
            }
            onClick={() => onSelect(u)}
          >
            <div style={{ position: "relative" }}>
              <img
                className="user-avatar"
                src={u.avatar || "/Aqua.png"}
                alt={u.username}
              />
              {u.is_online && (
                <span
                  className="online-dot"
                  title="Online"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#4caf50",
                    border: "2px solid white",
                  }}
                />
              )}
            </div>
            {u.username}
          </li>
        ))}
      </ul>
    </div>
  );
}
