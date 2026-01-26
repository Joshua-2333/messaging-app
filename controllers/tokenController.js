// controllers/tokenController.js
import jwt from "jsonwebtoken";
import pool from "../db/pool.js";

export async function refreshToken(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token required" });
  }

  const result = await pool.query(
    "SELECT * FROM refresh_tokens WHERE token = $1",
    [refreshToken]
  );

  const storedToken = result.rows[0];

  if (!storedToken) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { id: decoded.id, username: decoded.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
}
