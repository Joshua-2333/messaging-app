// routes/conversationsRoutes.js
import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { createConversation, getConversations } from "../controllers/conversationsController.js";

const router = Router();

router.post("/", authenticate, createConversation);
router.get("/", authenticate, getConversations);

export default router;
