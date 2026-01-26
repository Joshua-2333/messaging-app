// controllers/messagesController.js
import pool from "../db/pool.js";

export async function sendMessage(req, res) {
  const senderId = req.user.id;
  const { conversation_id, content } = req.body;

  if (!conversation_id || !content) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const result = await pool.query(
    `
    INSERT INTO messages (conversation_id, sender_id, content)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [conversation_id, senderId, content]
  );

  res.status(201).json(result.rows[0]);
}

export async function getMessages(req, res) {
  const { conversation_id } = req.params;

  const result = await pool.query(
    `
    SELECT *
    FROM messages
    WHERE conversation_id = $1
    ORDER BY created_at ASC
    `,
    [conversation_id]
  );

  res.json(result.rows);
}
