import AdminAnalytics from '../models/AdminAnalytics.js';
import Payment from '../models/paymentModel.js';
import Booking from '../models/bookingModel.js';
import Course from '../models/courseModel.js';
import User from '../models/userModel.js';
import mongoose from 'mongoose';

// DAU (Daily Active Users)
export const dailyActiveUsers = async (req, res) => {
  const { start, end } = req.query; // YYYY-MM-DD
  const match = {};
  if (start && end) {
    match.date = { $gte: start, $lte: end };
  }
  const data = await AdminAnalytics.aggregate([
    { $match: match },
    { $project: { date: 1, activeUsers: "$activeUsers", newUsers: "$newUsers" } },
    { $sort: { date: 1 } }
  ]);
  res.json(data);
};

// Revenue by day / monthly
export const monthlyRevenue = async (req, res) => {
  const days = Number(req.query.days || 30);
  const from = new Date();
  from.setDate(from.getDate() - (days - 1));
  const isoFrom = from.toISOString();

  const data = await Payment.aggregate([
    { $match: { status: 'success', createdAt: { $gte: new Date(isoFrom) } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenueCents: { $sum: '$amount' },
        payments: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } }
  ]);
  res.json(data);
};

// Top courses by revenue & enrollments
export const topCourses = async (req, res) => {
  const data = await Payment.aggregate([
    { $match: { status: 'success', course: { $ne: null } } },
    { $group: { _id: '$course', revenueCents: { $sum: '$amount' }, sales: { $sum: 1 } } },
    { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'course' } },
    { $unwind: '$course' },
    { $project: { revenueCents: 1, sales: 1, title: '$course.title', instructor: '$course.instructor' } },
    { $sort: { revenueCents: -1 } },
    { $limit: 10 }
  ]);
  res.json(data);
};