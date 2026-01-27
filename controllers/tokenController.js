// controllers/tokenController.js
import jwt from "jsonwebtoken";
import pool from "../db/pool.js";

function setRefreshCookie(res, token) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

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

    // Generate NEW tokens
    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const newRefreshToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Rotate refresh token
    await pool.query(
      "DELETE FROM refresh_tokens WHERE token = $1",
      [refreshToken]
    );

    await pool.query(
      "INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)",
      [user.id, newRefreshToken]
    );

    // set new refresh token cookie
    setRefreshCookie(res, newRefreshToken);

    res.json({ user, accessToken });
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
}
