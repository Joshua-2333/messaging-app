// client/src/components/NewConversationModal.jsx
import React, { useEffect, useRef } from "react";

export default function NewConversationModal({ open, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (open) {
      dialogRef.current?.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-convo-title"
        tabIndex={-1}
        ref={dialogRef}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      >
        <h3 id="new-convo-title">New Conversation</h3>

        <p>This will start a new chat.</p>

        <div className="modal-actions">
          <button className="primary-btn">Create</button>
          <button className="secondary-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
