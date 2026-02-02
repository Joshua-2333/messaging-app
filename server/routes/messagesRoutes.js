// server/routes/messagesRoutes.js
import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { getMessagesByGroup, sendMessage } from "../controllers/messagesController.js";

const router = express.Router();

// Get messages for a group
router.get("/:groupId", authenticate, getMessagesByGroup);

// Post a new message
router.post("/", authenticate, sendMessage);

export default router;
