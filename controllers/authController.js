// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db/pool.js";

function generateTokens(user) {
  const accessToken = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
}

// Validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const passwordRegex = /^(?=.*[A-Z]).{6,}$/;

// Set refresh cookie with optional "remember me" flag
function setRefreshCookie(res, token, remember = true) {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  if (remember) {
    options.maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
  }

  res.cookie("refreshToken", token, options);
}

// ------------------ REGISTER ------------------
export async function register(req, res) {
  const { username, password, email } = req.body;

  if (!username || username.trim().length < 3) {
    return res.status(400).json({ message: "Username must be at least 3 characters." });
  }
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Email must be valid." });
  }
  if (!password || !passwordRegex.test(password)) {
    return res.status(400).json({
      message: "Password must be at least 6 characters and include 1 capital letter.",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email
      `,
      [username, email, hashedPassword]
    );

    const user = result.rows[0];
    const tokens = generateTokens(user);

    await pool.query(
      "INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)",
      [user.id, tokens.refreshToken]
    );

    setRefreshCookie(res, tokens.refreshToken); // always remember on register

    res.status(201).json({ user, accessToken: tokens.accessToken });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Username or email already exists" });
  }
}

// ------------------ LOGIN ------------------
export async function login(req, res) {
  const { usernameOrEmail, password, rememberMe } = req.body;

  if (!usernameOrEmail || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  const result = await pool.query(
    `SELECT * FROM users WHERE username = $1 OR email = $1`,
    [usernameOrEmail]
  );

  const user = result.rows[0];
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const tokens = generateTokens(user);

  await pool.query(
    "INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)",
    [user.id, tokens.refreshToken]
  );

  setRefreshCookie(res, tokens.refreshToken, rememberMe); // <-- respect rememberMe

  res.json({ user, accessToken: tokens.accessToken });
}

// ------------------ LOGOUT ------------------
export async function logout(req, res) {
  const refreshToken = req.cookies.refreshToken;

  await pool.query(
    "DELETE FROM refresh_tokens WHERE token = $1",
    [refreshToken]
  );

  res.clearCookie("refreshToken");

  res.json({ message: "Logged out" });
}

// ------------------ REFRESH ------------------
export async function refreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  const result = await pool.query(
    "SELECT * FROM refresh_tokens WHERE token = $1",
    [refreshToken]
  );

  if (!result.rows.length) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const userResult = await pool.query(
      "SELECT id, username, email FROM users WHERE id = $1",
      [decoded.id]
    );

    const user = userResult.rows[0];

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const tokens = generateTokens(user);

    await pool.query(
      "DELETE FROM refresh_tokens WHERE token = $1",
      [refreshToken]
    );

    await pool.query(
      "INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)",
      [user.id, tokens.refreshToken]
    );

    setRefreshCookie(res, tokens.refreshToken);

    res.json({ user, accessToken: tokens.accessToken });
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
}
