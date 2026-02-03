// client/src/components/UserList.jsx
import React from "react";

export default function UserList({
  users = [],
  currentUser,
  onSelect,
  selectedChat,
}) {
  // Hard guard: do NOT render until we have a real user
  if (!currentUser || !currentUser.id || !currentUser.username) {
    return null;
  }

  return (
    <div className="user-list-container">
      <h4>Users</h4>
      <ul>
        {/* Current logged-in user */}
        <li className="current-user">
          {currentUser.avatar && (
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              className="user-avatar"
            />
          )}
          <span>{currentUser.username}</span>
        </li>

        {/* Other users */}
        {users
          .filter(
            (u) =>
              u.id &&
              u.username &&
              u.id !== currentUser.id
          )
          .map((u) => (
            <li
              key={u.id}
              className={
                selectedChat?.type === "dm" &&
                selectedChat.data?.id === u.id
                  ? "selected"
                  : ""
              }
              onClick={() => onSelect(u)}
            >
              {u.avatar && (
                <img
                  src={u.avatar}
                  alt={u.username}
                  className="user-avatar"
                />
              )}
              <span>{u.username}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}
