// server/controllers/groupsController.js
import pool from "../db/pool.js";

// Get all groups
export async function getAllGroups(req, res) {
  try {
    const result = await pool.query(`SELECT id, name, is_private, avatar, created_at FROM groups`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch groups" });
  }
}

// Get a specific group and its members
export async function getGroupById(req, res) {
  const { id } = req.params;
  try {
    const group = await pool.query(
      `SELECT id, name, is_private, avatar, created_at FROM groups WHERE id=$1`,
      [id]
    );
    if (!group.rows.length) return res.status(404).json({ message: "Group not found" });

    const members = await pool.query(
      `SELECT u.id, u.username, u.avatar
       FROM users u
       JOIN group_users gu ON u.id = gu.user_id
       WHERE gu.group_id=$1`,
      [id]
    );

    res.json({ ...group.rows[0], members: members.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch group" });
  }
}

// Add a user to a group
export async function addUserToGroup(req, res) {
  const { groupId, userId } = req.body;
  try {
    await pool.query(
      `INSERT INTO group_users (group_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [groupId, userId]
    );
    res.json({ message: "User added to group" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add user to group" });
  }
}
