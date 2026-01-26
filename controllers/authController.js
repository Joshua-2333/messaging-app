// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db/pool.js";

export async function register(req, res) {
  const { username, password, display_name } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users (username, password, display_name)
      VALUES ($1, $2, $3)
      RETURNING id, username, display_name
      `,
      [username, hashedPassword, display_name || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Username already exists" });
  }
}

export async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  const result = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );

  const user = result.rows[0];

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
}
