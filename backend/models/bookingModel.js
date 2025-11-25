import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: false,
    },

    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: false,
    },

    // scheduled start time (ISO)
    startAt: {
      type: Date,
      required: true,
      index: true,
    },

    // optional end time
    endAt: Date,

    // booking status
    status: {
      type: String,
      enum: ["requested", "confirmed", "cancelled", "completed", "no-show"],
      default: "requested",
      index: true,
    },

    // booking channel: direct, marketplace, admin
    channel: {
      type: String,
      enum: ["direct", "marketplace", "admin"],
      default: "direct",
    },

    price: {
      type: Number,
      default: 0,
    },

    currency: {
      type: String,
      default: "USD",
    },

    notes: {
      type: String,
    },

    // payment relation (if paid)
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },

    meta: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

// index for fast queries on teacher + date range
BookingSchema.index({ teacher: 1, startAt: 1 });

export default mongoose.model("Booking", BookingSchema);