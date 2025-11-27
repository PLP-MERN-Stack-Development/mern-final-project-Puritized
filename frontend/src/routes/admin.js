// backend/routes/admin.js
import express from "express";
import {
  getAdminSummary,
  getUsers,
  updateUserRole,
  deleteUser,
  getAdminCourses,
  publishCourse,
  unpublishCourse,
  deleteCourse,
  getPayments,
  refundPayment
} from "../controllers/adminController.js";
import { requireAuth, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/summary", requireAuth, isAdmin, getAdminSummary);

// Users
router.get("/users", requireAuth, isAdmin, getUsers);
router.patch("/users/:id/role", requireAuth, isAdmin, updateUserRole);
router.delete("/users/:id", requireAuth, isAdmin, deleteUser);

// Courses
router.get("/courses", requireAuth, isAdmin, getAdminCourses);
router.post("/courses/:id/publish", requireAuth, isAdmin, publishCourse);
router.post("/courses/:id/unpublish", requireAuth, isAdmin, unpublishCourse);
router.delete("/courses/:id", requireAuth, isAdmin, deleteCourse);

// Payments
router.get("/payments", requireAuth, isAdmin, getPayments);
router.post("/payments/:id/refund", requireAuth, isAdmin, refundPayment);

export default router;