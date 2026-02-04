// server/controllers/usersController.js
import pool from "../db/pool.js";

/* ------------------ GET ALL USERS ------------------ */
export async function getAllUsers(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, username, email, avatar, is_online FROM users ORDER BY username ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
}

/* ------------------ GET USER BY ID ------------------ */
export async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT id, username, email, avatar, is_online FROM users WHERE id=$1`,
      [id]
    );
    if (!result.rows.length) return res.status(404).json({ message: "User not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
}
