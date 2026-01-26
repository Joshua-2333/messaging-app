// routes/messagesRoutes.js
import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { sendMessage, getMessages } from "../controllers/messagesController.js";

const router = Router();

router.post("/", authenticate, sendMessage);
router.get("/:conversation_id", authenticate, getMessages);

export default router;
