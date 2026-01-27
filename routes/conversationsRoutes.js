// routes/conversationsRoutes.js
import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  createConversation,
  getConversations,
  archiveConversation
} from "../controllers/conversationsController.js";

const router = Router();

router.post("/", authenticate, createConversation);
router.get("/", authenticate, getConversations);

// archive conversation
router.patch("/:id/archive", authenticate, archiveConversation);

export default router;
