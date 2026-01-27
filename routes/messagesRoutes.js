// routes/messagesRoutes.js
import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  sendMessage,
  getMessages,
  markConversationRead,
  deleteMessage
} from "../controllers/messagesController.js";

const router = Router();

router.post("/", authenticate, sendMessage);
router.get("/:conversation_id", authenticate, getMessages);

// mark all messages as read
router.patch("/:conversation_id/read", authenticate, markConversationRead);

// soft delete a message
router.delete("/message/:message_id", authenticate, deleteMessage);

export default router;
