// controllers/conversationsController.js
import pool from "../db/pool.js";

export async function createConversation(req, res) {
  const userOne = req.user.id;
  const { userTwo } = req.body;

  if (!userTwo) {
    return res.status(400).json({ message: "userTwo required" });
  }

  if (userOne === userTwo) {
    return res.status(400).json({ message: "Cannot message yourself" });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO conversations (user_one, user_two)
      VALUES ($1, $2)
      RETURNING *
      `,
      [userOne, userTwo]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: "Conversation already exists" });
  }
}

export async function getConversations(req, res) {
  const userId = req.user.id;

  const result = await pool.query(
    `
    SELECT *
    FROM conversations
    WHERE user_one = $1 OR user_two = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  res.json(result.rows);
}
