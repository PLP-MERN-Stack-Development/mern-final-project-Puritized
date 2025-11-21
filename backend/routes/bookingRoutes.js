import express from "express";
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking
} from "../controllers/bookingController.js";

import { protect, isAdmin, isTutor } from "../middleware/auth.js";

const router = express.Router();

/* ------------------------------------------
   BOOKING ROUTES
------------------------------------------- */

// Create a booking
router.post("/", protect, createBooking);

// Get all bookings (admin only)
router.get("/", protect, isAdmin, getAllBookings);

// Get current user's bookings
router.get("/me", protect, getUserBookings);

// Get single booking by ID
router.get("/:id", protect, getBookingById);

// Update booking by ID
router.put("/:id", protect, updateBooking);

// Delete booking by ID
router.delete("/:id", protect, isAdmin, deleteBooking);

export default router;