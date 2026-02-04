// server/controllers/authController.js
import pool from "../db/pool.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";

/*REGISTER*/
export async function register(req, res) {
  const { username, email, password, avatar } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users (username, email, password, avatar)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, email, avatar, is_online
      `,
      [username, email, hashed, avatar || null]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    res.status(201).json({ user, token });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(400).json({ message: "Registration failed" });
  }
}

/*LOGIN*/
export async function login(req, res) {
  const { usernameOrEmail, password } = req.body;

  try {
    const result = await pool.query(
      `
      SELECT * FROM users
      WHERE username = $1 OR email = $1
      `,
      [usernameOrEmail]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Mark user online
    await pool.query(
      "UPDATE users SET is_online = TRUE WHERE id = $1",
      [user.id]
    );

    const token = generateToken(user);

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        is_online: true,
      },
      token,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
}

/*LOGOUT*/
export async function logout(req, res) {
  try {
    const userId = req.user.id;

    await pool.query(
      "UPDATE users SET is_online = FALSE WHERE id = $1",
      [userId]
    );

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("LOGOUT ERROR:", err);
    res.status(500).json({ message: "Logout failed" });
  }
}
