// server/middleware/authMiddleware.js
import { verifyToken } from "../utils/jwt.js";

/**
 * Middleware to protect routes using JWT.
 * Expects Authorization header: "Bearer <token>"
 */
export function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // Check header exists
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    // Check format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid authorization format" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Attach user info to request
    req.user = decoded; // { id, username, iat, exp }

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({ message: "Authentication failed" });
  }
}
