import express from "express";
import { requireAuth, isStudent } from "../middleware/authMiddleware.js";
import {
  markLessonComplete,
  getStudentProgress,
} from "../controllers/progressController.js";

const router = express.Router();

router.use(requireAuth, isStudent);

router.post("/complete", markLessonComplete);
router.get("/", getStudentProgress);

export default router;