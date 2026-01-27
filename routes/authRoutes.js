// routes/authRoutes.js
import { Router } from "express";
import { register, login, logout, refreshToken } from "../controllers/authController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);

export default router;
