import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

import {
  getSummary,
  getRevenueTimeseries,
  getUsers,
  updateUserRole,
  deleteUser,
  getAdminCourses,
  publishCourse,
  unpublishCourse,
  deleteCourse,
  getPayments,
  refundPayment,
} from "../controllers/adminController.js";

const router = express.Router();

//  DASHBOARD ANALYTICS
router.get("/summary", requireAuth, isAdmin, getSummary);
router.get("/revenue", requireAuth, isAdmin, getRevenueTimeseries);

//  USER MANAGEMENT
router.get("/users", requireAuth, isAdmin, getUsers);
router.patch("/users/:id/role", requireAuth, isAdmin, updateUserRole);
router.delete("/users/:id", requireAuth, isAdmin, deleteUser);

//  COURSE MANAGEMENT  (THIS FIXES YOUR 404)
router.get("/courses", requireAuth, isAdmin, getAdminCourses);
router.post("/courses/:id/publish", requireAuth, isAdmin, publishCourse);
router.post("/courses/:id/unpublish", requireAuth, isAdmin, unpublishCourse);
router.delete("/courses/:id", requireAuth, isAdmin, deleteCourse);

//  PAYMENT MANAGEMENT
router.get("/payments", requireAuth, isAdmin, getPayments);
router.post("/payments/:id/refund", requireAuth, isAdmin, refundPayment);

export default router;