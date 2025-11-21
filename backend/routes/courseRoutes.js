import express from "express";
import {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse
} from "../controllers/courseController.js";
import { isTutor, protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/")
  .get(getCourses)
  .post(protect, isTutor, createCourse);

router.route("/:id")
  .get(getCourse)
  .put(protect, isTutor, updateCourse)
  .delete(protect, isTutor, deleteCourse);

export default router;