// server/routes/authRoutes.js
import express from "express";
import { register, login } from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import pool from "../db/pool.js";

const router = express.Router();

/*REGISTER*/
router.post("/register", register);

/*LOGIN*/
router.post("/login", login);

/*GET CURRENT USER
   Protected route: returns logged-in user*/
router.get("/me", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT id, username, email, avatar FROM users WHERE id=$1",
      [userId]
    );

    if (!result.rows[0]) return res.status(404).json({ message: "User not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Failed to fetch current user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
