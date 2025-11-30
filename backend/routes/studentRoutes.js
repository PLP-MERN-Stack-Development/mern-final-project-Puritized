// backend/routes/studentRoutes.js
import express from "express";
import { requireAuth, isStudent } from "../middleware/authMiddleware.js";
import {
  getEnrollments,
  enrollCourse,
  unenroll,
} from "../controllers/studentController.js";

const router = express.Router();

// Protect all student routes
router.use(requireAuth, isStudent);

// Student endpoints
router.get("/enrollments", getEnrollments);
router.post("/enroll", enrollCourse);
router.delete("/enroll/:id", unenroll);

export default router;