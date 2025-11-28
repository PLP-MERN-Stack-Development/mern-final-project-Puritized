import express from "express";
import {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse
} from "../controllers/courseController.js";
import { protect, isTeacher } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route: /api/courses
router
  .route("/")
  .get(getCourses)                     // ✅ Public: anyone can view courses
  .post(protect, isTeacher, createCourse); // ✅ Teacher-only: create course

// Route: /api/courses/:id
router
  .route("/:id")
  .get(getCourse)                      // ✅ Public: view single course
  .put(protect, isTeacher, updateCourse)   // ✅ Teacher-only: update course
  .delete(protect, isTeacher, deleteCourse); // ✅ Teacher-only: delete course

export default router;