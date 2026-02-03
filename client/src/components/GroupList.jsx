// client/src/components/GroupList.jsx
import React from "react";

export default function GroupList({ groups, onSelect, selectedChat }) {
  return (
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
            onClick={() => onSelect(group)}
          >
            {group.avatar && (
              <img
                src={group.avatar}
                alt={group.name}
                className="group-avatar"
              />
            )}
            {group.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
