import express from "express";
import { requireAuth, isTeacher } from "../middleware/authMiddleware.js";
import {
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson,
} from "../controllers/teacherLessonController.js";

const router = express.Router();

router.use(requireAuth, isTeacher);

router.get("/lessons/:courseId", getLessons);
router.post("/lessons", createLesson);
router.patch("/lessons/:id", updateLesson);
router.delete("/lessons/:id", deleteLesson);

export default router;