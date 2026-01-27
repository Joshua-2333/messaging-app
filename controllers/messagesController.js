// controllers/messagesController.js
import pool from "../db/pool.js";

/* Send a message */
export async function sendMessage(req, res) {
  const senderId = req.user.id;
  const { conversation_id, content } = req.body;

  if (!conversation_id || !content) {
    return res.status(400).json({ message: "Missing fields" });
  }

  // Verify user belongs to conversation
  const convoCheck = await pool.query(
    `
    SELECT id
    FROM conversations
    WHERE id = $1
      AND archived_at IS NULL
      AND (user_one = $2 OR user_two = $2)
    `,
    [conversation_id, senderId]
  );

  if (!convoCheck.rows.length) {
    return res.status(403).json({ message: "Access denied" });
  }

  const message = await pool.query(
    `
    INSERT INTO messages (conversation_id, sender_id, content)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [conversation_id, senderId, content]
  );

  // Update conversation activity
  await pool.query(
    `
    UPDATE conversations
    SET last_message_at = CURRENT_TIMESTAMP
    WHERE id = $1
    `,
    [conversation_id]
  );

  res.status(201).json(message.rows[0]);
}

/* Get messages in a conversation */
export async function getMessages(req, res) {
  const userId = req.user.id;
  const { conversation_id } = req.params;

  const convoCheck = await pool.query(
    `
    SELECT id
    FROM conversations
    WHERE id = $1
      AND (user_one = $2 OR user_two = $2)
    `,
    [conversation_id, userId]
  );

  if (!convoCheck.rows.length) {
    return res.status(403).json({ message: "Access denied" });
  }

  const result = await pool.query(
    `
    SELECT *
    FROM messages
    WHERE conversation_id = $1
      AND deleted_at IS NULL
    ORDER BY created_at ASC, id ASC
    `,
    [conversation_id]
  );

  res.json(result.rows);
}

/* Mark all messages in a conversation as read (per user) */
export async function markConversationRead(req, res) {
  const userId = req.user.id;
  const { conversation_id } = req.params;

  const convoCheck = await pool.query(
    `
    SELECT id
    FROM conversations
    WHERE id = $1
      AND (user_one = $2 OR user_two = $2)
    `,
    [conversation_id, userId]
  );

  if (!convoCheck.rows.length) {
    return res.status(403).json({ message: "Access denied" });
  }

  await pool.query(
    `
    UPDATE messages
    SET read_at = CURRENT_TIMESTAMP
    WHERE conversation_id = $1
      AND sender_id <> $2
      AND read_at IS NULL
      AND deleted_at IS NULL
    `,
    [conversation_id, userId]
  );

  res.json({ message: "Messages marked as read" });
}

/* Soft delete a message (sender only) */
export async function deleteMessage(req, res) {
  const userId = req.user.id;
  const { message_id } = req.params;

  const messageCheck = await pool.query(
    `
    SELECT id
    FROM messages
    WHERE id = $1
      AND sender_id = $2
      AND deleted_at IS NULL
    `,
    [message_id, userId]
  );

  if (!messageCheck.rows.length) {
    return res.status(403).json({ message: "Cannot delete this message" });
  }

  await pool.query(
    `
    UPDATE messages
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE id = $1
    `,
    [message_id]
  );

  res.json({ message: "Message deleted" });
}
