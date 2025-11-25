import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { permit } from "../middleware/roleMiddleware.js";
import { getSummary, getRevenueTimeseries } from "../controllers/adminController.js";

const router = express.Router();

// Protect admin endpoints
router.get("/summary", requireAuth, permit("admin"), getSummary);
router.get("/revenue", requireAuth, permit("admin"), getRevenueTimeseries);

export default router;