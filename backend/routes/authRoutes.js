import express from "express";
import { register, login, refresh, me, logout } from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Routes:
 * POST   /routes/auth/register
 * POST   /routes/auth/login
 * GET    /routes/auth/refresh
 * GET    /routes/auth/me
 * POST   /routes/auth/logout
 */

router.post("/register", register);
router.post("/login", login);
router.get("/refresh", refresh);
router.get("/me", requireAuth, me);
router.post("/logout", requireAuth, logout);

export default router;