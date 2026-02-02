// server/utils/jwt.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Use env secret or fallback
const SECRET = process.env.JWT_SECRET || "supersecret";

/**
 * Generate a JWT for a given payload.
 * @param {Object} payload - Data to encode (e.g., { id, username })
 * @returns {string} JWT token
 */
export function generateToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" }); // 7 days expiry
}

/**
 * Verify a JWT token.
 * @param {string} token - JWT token string
 * @returns {Object|null} Decoded payload or null if invalid/expired
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    console.warn("JWT verification failed:", err.message);
    return null;
  }
}
