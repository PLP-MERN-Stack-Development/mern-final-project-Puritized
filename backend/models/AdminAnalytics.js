import mongoose from 'mongoose';

/**
 * Lightweight analytics store for admin dashboards.
 * For heavy analytics prefer storing event streams in an analytics DB.
 *
 * This model stores aggregated counters and can be updated by cron jobs
 * or event handlers (e.g., on user signup, course purchase, lesson complete).
 */
const adminAnalyticsSchema = new mongoose.Schema({
  date: { type: String, required: true, index: true }, // YYYY-MM-DD
  newUsers: { type: Number, default: 0 },
  activeUsers: { type: Number, default: 0 },
  newCourses: { type: Number, default: 0 },
  coursePurchases: { type: Number, default: 0 },
  revenueCents: { type: Number, default: 0 }, // in smallest unit
  lessonsCompleted: { type: Number, default: 0 },
  bookingsCreated: { type: Number, default: 0 },
  paymentsSucceeded: { type: Number, default: 0 },
  custom: { type: mongoose.Schema.Types.Mixed } // any other aggregated KPIs
}, { timestamps: true });

// upsert-friendly find key
adminAnalyticsSchema.index({ date: 1 }, { unique: true });

export default mongoose.model('AdminAnalytics', adminAnalyticsSchema);