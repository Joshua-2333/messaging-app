// server/controllers/messagesController.js
import pool from "../db/pool.js";

// Get messages for a group
export async function getMessagesByGroup(req, res) {
  const { groupId } = req.params;
  try {
    const result = await pool.query(
      `SELECT m.id, m.content, m.created_at, u.id as sender_id, u.username, u.avatar
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.group_id=$1
       ORDER BY m.created_at ASC`,
      [groupId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
}

// Send a message
export async function sendMessage(req, res) {
  const { senderId, groupId, content } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO messages (sender_id, group_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, sender_id, group_id, content, created_at`,
      [senderId, groupId, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send message" });
  }
}
