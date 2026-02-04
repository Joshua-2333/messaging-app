// server/routes/messagesRoutes.js
import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  getMessagesByGroup,
  sendMessage,
  getDMByUser,
  sendDM,
} from "../controllers/messagesController.js";

const router = express.Router();

/*GROUP MESSAGES*/
router.get("/:groupId", authenticate, getMessagesByGroup);
router.post("/", authenticate, sendMessage);

/*DIRECT MESSAGES*/
router.get("/dm/:userId", authenticate, getDMByUser);
router.post("/dm", authenticate, sendDM);

export default router;
