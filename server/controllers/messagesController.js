// server/controllers/messagesController.js
import pool from "../db/pool.js";

/*GROUP MESSAGES*/
export async function getMessagesByGroup(req, res) {
  const { groupId } = req.params;
  try {
    const result = await pool.query(
      `SELECT m.id, m.content, m.created_at,
              u.id AS sender_id, u.username, u.avatar
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.group_id = $1
       ORDER BY m.created_at ASC`,
      [groupId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching group messages:", err.message);
    res.status(500).json({ message: "Failed to fetch group messages" });
  }
}

export async function sendMessage(req, res) {
  const { groupId, content } = req.body;
  const senderId = req.user.id;

  if (!content) return res.status(400).json({ message: "Message content is required" });

  try {
    const result = await pool.query(
      `INSERT INTO messages (sender_id, group_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, content, created_at, sender_id`,
      [senderId, groupId || null, content]
    );

    // Get sender info
    const senderInfo = await pool.query(
      `SELECT username, avatar FROM users WHERE id = $1`,
      [senderId]
    );

    res.status(201).json({
      ...result.rows[0],
      username: senderInfo.rows[0].username,
      avatar: senderInfo.rows[0].avatar,
    });
  } catch (err) {
    console.error("Error sending group message:", err.message);
    res.status(500).json({ message: "Failed to send group message" });
  }
}

/*DIRECT MESSAGES*/
export async function getDMByUser(req, res) {
  const { userId } = req.params;
  const authUserId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT m.id, m.content, m.created_at,
              u.id AS sender_id, u.username, u.avatar
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE (m.sender_id = $1 AND m.recipient_id = $2)
          OR (m.sender_id = $2 AND m.recipient_id = $1)
       ORDER BY m.created_at ASC`,
      [authUserId, userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching DMs:", err.message);
    res.status(500).json({ message: "Failed to fetch direct messages" });
  }
}

export async function sendDM(req, res) {
  const { recipientId, content } = req.body;
  const senderId = req.user.id;

  if (!recipientId || !content)
    return res.status(400).json({ message: "Recipient and content required" });

  try {
    const result = await pool.query(
      `INSERT INTO messages (sender_id, recipient_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, content, created_at, sender_id, recipient_id`,
      [senderId, recipientId, content]
    );

    // Get sender info
    const senderInfo = await pool.query(
      `SELECT username, avatar FROM users WHERE id = $1`,
      [senderId]
    );

    res.status(201).json({
      ...result.rows[0],
      username: senderInfo.rows[0].username,
      avatar: senderInfo.rows[0].avatar,
    });
  } catch (err) {
    console.error("Error sending DM:", err.message);
    res.status(500).json({ message: "Failed to send direct message" });
  }
}
