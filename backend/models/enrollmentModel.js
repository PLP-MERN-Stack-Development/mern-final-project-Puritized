import mongoose from "mongoose";

const EnrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    // Payment link (if the course is paid)
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },

    progress: {
      type: Number, // 0–100%
      default: 0,
      min: 0,
      max: 100,
    },

    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],

    status: {
      type: String,
      enum: ["active", "completed", "expired"],
      default: "active",
    },

    expiresAt: {
      type: Date,
    },

    meta: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

EnrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.model("Enrollment", EnrollmentSchema);