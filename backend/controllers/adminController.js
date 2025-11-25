import User from "../models/userModel.js";
import Course from "../models/courseModel.js";
import Payment from "../models/paymentModel.js";
import Booking from "../models/bookingModel.js";
import Transaction from "../models/transactionModel.js";
import Enrollment from "../models/enrollmentModel.js";

/**
 * GET /routes/admin/summary
 * Return high-level dashboard stats
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

    // revenue in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
    const revenueAgg = await Payment.aggregate([
      { $match: { status: "completed", paidAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);

    const revenueLast30 = (revenueAgg[0]?.total) || 0;
    const revenueCount = (revenueAgg[0]?.count) || 0;

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
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /routes/admin/revenue?from=YYYY-MM-DD&to=YYYY-MM-DD
 * Returns timeseries revenue grouped by day
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
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};