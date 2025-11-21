import express from "express";
import {
  createLesson,
  getLessonsByCourse,
  updateLesson,
  deleteLesson
} from "../controllers/lessonController.js";
import { isTutor, protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, isTutor, createLesson);
router.get("/course/:courseId", getLessonsByCourse);

router.route("/:id")
  .put(protect, isTutor, updateLesson)
  .delete(protect, isTutor, deleteLesson);

export default router;