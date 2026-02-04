// server/routes/usersRoutes.js
import express from "express";
import { getAllUsers, getUserById } from "../controllers/usersController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getAllUsers);
router.get("/:id", authenticate, getUserById);

export default router;
