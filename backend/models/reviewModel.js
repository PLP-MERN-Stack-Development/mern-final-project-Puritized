import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    meta: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ course: 1, student: 1 }, { unique: true });

// Recalculate AVG rating after each review save
ReviewSchema.post("save", async function () {
  const Review = mongoose.model("Review");
  const Course = mongoose.model("Course");

  const stats = await Review.aggregate([
    { $match: { course: this.course } },
    {
      $group: {
        _id: "$course",
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  const avg = stats.length > 0 ? stats[0].avgRating : 0;

  await Course.findByIdAndUpdate(this.course, {
    averageRating: avg,
  });
});


export default mongoose.model("Review", ReviewSchema);