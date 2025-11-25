import express from "express";
import {
  dailyActiveUsers,
  monthlyRevenue,
  topCourses
} from "../controllers/analyticsController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dau", protect, isAdmin, dailyActiveUsers);
router.get("/revenue/monthly", protect, isAdmin, monthlyRevenue);
router.get("/courses/top", protect, isAdmin, topCourses);

export default router;