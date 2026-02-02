// server/routes/usersRoutes.js
import express from "express";
import { getAllUsers, getUserById } from "../controllers/usersController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all users (except current)
router.get("/", authenticate, getAllUsers);

// Get a single user by ID
router.get("/:id", authenticate, getUserById);

export default router;
