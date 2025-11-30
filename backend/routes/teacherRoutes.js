// backend/routes/teacherRoutes.js
import express from "express";
import {
  getTeacherCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseStudents,
} from "../controllers/teacherController.js";

import { requireAuth, isTeacher } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication and teacher role
router.use(requireAuth, isTeacher);

// Teacher course CRUD
router.get("/courses", getTeacherCourses);
router.post("/courses", createCourse);
router.patch("/courses/:id", updateCourse);
router.delete("/courses/:id", deleteCourse);

// Students in a course
router.get("/courses/:id/students", getCourseStudents);

export default router;