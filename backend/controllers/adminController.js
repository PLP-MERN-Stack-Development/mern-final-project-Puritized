import User from "../models/userModel.js";
import Course from "../models/courseModel.js";
import Payment from "../models/paymentModel.js";
import Booking from "../models/bookingModel.js";
import Transaction from "../models/transactionModel.js";
import Enrollment from "../models/enrollmentModel.js";

/**
 * ✅ DASHBOARD SUMMARY
 * GET /api/admin/summary
 */
export const getSummary = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTeachers = await User.countDocuments({ role: "teacher" });
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();
    const pendingPayments = await Payment.countDocuments({ status: "pending" });
    const completedPayments = await Payment.countDocuments({ status: "completed" });

    // ✅ Revenue in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);

    const revenueAgg = await Payment.aggregate([
      { $match: { status: "completed", paidAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);

    const revenueLast30 = revenueAgg[0]?.total || 0;
    const revenueCount = revenueAgg[0]?.count || 0;

    return res.json({
      totalUsers,
      totalStudents,
      totalTeachers,
      totalCourses,
      totalEnrollments,
      pendingPayments,
      completedPayments,
      revenueLast30,
      revenueCount,
    });
  } catch (err) {
    console.error("Admin summary error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * ✅ REVENUE TIMESERIES
 * GET /api/admin/revenue
 */
export const getRevenueTimeseries = async (req, res) => {
  try {
    const { from, to } = req.query;
    const start = from ? new Date(from) : new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
    const end = to ? new Date(to) : new Date();

    const agg = await Payment.aggregate([
      { $match: { status: "completed", paidAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.json({ data: agg });
  } catch (err) {
    console.error("Revenue chart error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ===========================================================
   ✅ USERS MANAGEMENT
   =========================================================== */

/**
 * GET /api/admin/users
 */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -refreshToken")
      .sort({ createdAt: -1 });

    res.json({ users });
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Failed to load users" });
  }
};

/**
 * PATCH /api/admin/users/:id/role
 */
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["student", "teacher", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password -refreshToken");

    res.json(user);
  } catch (err) {
    console.error("Update user role error:", err);
    res.status(500).json({ message: "Role update failed" });
  }
};

/**
 * DELETE /api/admin/users/:id
 */
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};

/* ===========================================================
   ✅ COURSES MANAGEMENT
   =========================================================== */

/**
 * GET /api/admin/courses
 */
export const getAdminCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json({ courses });
  } catch (err) {
    console.error("Get courses error:", err);
    res.status(500).json({ message: "Failed to load courses" });
  }
};

/**
 * POST /api/admin/courses/:id/publish
 */
export const publishCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { isPublished: true, publishedAt: new Date() },
      { new: true }
    );
    res.json(course);
  } catch (err) {
    console.error("Publish course error:", err);
    res.status(500).json({ message: "Publish failed" });
  }
};

/**
 * POST /api/admin/courses/:id/unpublish
 */
export const unpublishCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { isPublished: false },
      { new: true }
    );
    res.json(course);
  } catch (err) {
    console.error("Unpublish course error:", err);
    res.status(500).json({ message: "Unpublish failed" });
  }
};

/**
 * DELETE /api/admin/courses/:id
 */
export const deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted" });
  } catch (err) {
    console.error("Delete course error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};

/* ===========================================================
   ✅ PAYMENTS MANAGEMENT
   =========================================================== */

/**
 * GET /api/admin/payments
 */
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json({ payments });
  } catch (err) {
    console.error("Get payments error:", err);
    res.status(500).json({ message: "Failed to load payments" });
  }
};

/**
 * POST /api/admin/payments/:id/refund
 * (Flags only – real Paystack/Stripe refunds should go via webhook)
 */
export const refundPayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { refunded: true, status: "refunded" },
      { new: true }
    );

    res.json(payment);
  } catch (err) {
    console.error("Refund error:", err);
    res.status(500).json({ message: "Refund failed" });
  }
};