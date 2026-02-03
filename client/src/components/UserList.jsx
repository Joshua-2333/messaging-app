// client/src/components/UserList.jsx
import React from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function UserList({ users = [], selectedChat, onSelect }) {
  const { user } = useAuth();
  if (!user || !user.id) return null;

  // Only keep core users (Alice, Kyle, Sophie, Dan)
  const coreUsernames = ["Alice", "Kyle", "Sophie", "Dan"];
  const visibleUsers = users
    .filter(u => coreUsernames.includes(u.username) && u.id !== user.id);

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
            <img
              className="user-avatar"
              src={u.avatar || "/Aqua.png"}
              alt={u.username}
            />
            {u.username}
          </li>
        ))}
      </ul>
    </div>
  );
}
