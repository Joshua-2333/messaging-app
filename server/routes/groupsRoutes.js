// server/routes/groupsRoutes.js
import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { getAllGroups, getGroupById, addUserToGroup } from "../controllers/groupsController.js";

const router = express.Router();

// Get all groups for logged-in user
router.get("/", authenticate, getAllGroups);

// Get a single group with its members
router.get("/:id", authenticate, getGroupById);

// Add user to a group
router.post("/add-user", authenticate, addUserToGroup);

export default router;
