// client/src/components/ChatHeader.jsx
import React from "react";
import { useParams } from "react-router-dom";

export default function ChatHeader() {
  const { conversationId } = useParams();

  return (
    <header className="chat-header" role="banner">
      <h2 className="chat-title">
        {conversationId
          ? `Conversation #${conversationId}`
          : "Select a conversation"}
      </h2>
    </header>
  );
}
