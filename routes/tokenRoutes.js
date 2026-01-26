// routes/tokenRoutes.js
import { Router } from "express";
import { refreshToken } from "../controllers/tokenController.js";

const router = Router();

router.post("/refresh", refreshToken);

export default router;
