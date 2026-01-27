// controllers/conversationsController.js
import pool from "../db/pool.js";

/*Create or return existing conversation*/
export async function createConversation(req, res) {
  const userOne = req.user.id;
  const { userTwo } = req.body;

  if (!userTwo) {
    return res.status(400).json({ message: "userTwo required" });
  }

  if (userOne === userTwo) {
    return res.status(400).json({ message: "Cannot message yourself" });
  }

  const a = Math.min(userOne, userTwo);
  const b = Math.max(userOne, userTwo);

  try {
    const result = await pool.query(
      `
      INSERT INTO conversations (user_one, user_two)
      VALUES ($1, $2)
      ON CONFLICT (user_one, user_two) DO NOTHING
      RETURNING *
      `,
      [a, b]
    );

    if (!result.rows.length) {
      const existing = await pool.query(
        `
        SELECT *
        FROM conversations
        WHERE user_one = $1 AND user_two = $2
        `,
        [a, b]
      );
      return res.json(existing.rows[0]);
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create conversation" });
  }
}

/*Get conversations with unread counts (per user)*/
export async function getConversations(req, res) {
  const userId = req.user.id;

  const result = await pool.query(
    `
    SELECT
      c.id AS conversation_id,

      json_build_object(
        'id', u.id,
        'username', u.username,
        'display_name', u.display_name,
        'avatar_url', u.avatar_url
      ) AS other_user,

      COUNT(m.id) FILTER (
        WHERE m.read_at IS NULL
          AND m.deleted_at IS NULL
          AND m.sender_id <> $1
      ) AS unread_count,

      MAX(m.content) FILTER (WHERE m.created_at IS NOT NULL) AS last_message,
      MAX(m.created_at) AS last_message_at

    FROM conversations c

    JOIN users u
      ON u.id = CASE
        WHEN c.user_one = $1 THEN c.user_two
        ELSE c.user_one
      END

    LEFT JOIN messages m
      ON m.conversation_id = c.id
      AND m.deleted_at IS NULL

    WHERE
      (c.user_one = $1 AND c.archived_by_user_one = FALSE)
      OR
      (c.user_two = $1 AND c.archived_by_user_two = FALSE)

    GROUP BY c.id, u.id
    ORDER BY last_message_at DESC NULLS LAST
    `,
    [userId]
  );

  res.json(result.rows);
}

/*Archive a conversation*/
export async function archiveConversation(req, res) {
  const userId = req.user.id;
  const { id } = req.params;

  const convo = await pool.query(
    `
    SELECT user_one, user_two
    FROM conversations
    WHERE id = $1
    `,
    [id]
  );

  if (!convo.rows.length) {
    return res.status(404).json({ message: "Conversation not found" });
  }

  const { user_one, user_two } = convo.rows[0];

  if (userId !== user_one && userId !== user_two) {
    return res.status(403).json({ message: "Access denied" });
  }

  if (userId === user_one) {
    await pool.query(
      `
      UPDATE conversations
      SET archived_by_user_one = TRUE
      WHERE id = $1
      `,
      [id]
    );
  } else {
    await pool.query(
      `
      UPDATE conversations
      SET archived_by_user_two = TRUE
      WHERE id = $1
      `,
      [id]
    );
  }

  res.json({ message: "Conversation archived" });
}
