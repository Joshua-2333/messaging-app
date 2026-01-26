// controllers/usersController.js
import pool from "../db/pool.js";

export async function getUsers(req, res) {
  const result = await pool.query(
    "SELECT id, username, display_name, bio, avatar_url FROM users"
  );
  res.json(result.rows);
}

export async function getMyProfile(req, res) {
  const userId = req.user.id;

  const result = await pool.query(
    "SELECT id, username, display_name, bio, avatar_url FROM users WHERE id = $1",
    [userId]
  );

  res.json(result.rows[0]);
}

export async function updateMyProfile(req, res) {
  const userId = req.user.id;
  const { display_name, bio, avatar_url } = req.body;

  const result = await pool.query(
    `
    UPDATE users
    SET display_name = COALESCE($1, display_name),
        bio = COALESCE($2, bio),
        avatar_url = COALESCE($3, avatar_url)
    WHERE id = $4
    RETURNING id, username, display_name, bio, avatar_url
    `,
    [display_name, bio, avatar_url, userId]
  );

  res.json(result.rows[0]);
}
