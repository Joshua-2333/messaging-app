// routes/usersRoutes.js
import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { getUsers, getMyProfile, updateMyProfile } from "../controllers/usersController.js";

const router = Router();

router.get("/", authenticate, getUsers);
router.get("/me", authenticate, getMyProfile);
router.patch("/me", authenticate, updateMyProfile);

export default router;
