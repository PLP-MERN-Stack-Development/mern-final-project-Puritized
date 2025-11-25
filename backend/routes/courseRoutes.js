import express from "express";
import {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse
} from "../controllers/courseController.js";
import { isTeacher, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getCourses)
  .post(protect, isTeacher, createCourse);

router.route("/:id")
  .get(getCourse)
  .put(protect, isTeacher, updateCourse)
  .delete(protect, isTeacher, deleteCourse);

export default router;