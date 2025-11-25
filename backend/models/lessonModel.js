import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["video", "document", "link", "audio", "other"], default: "other" },
    title: { type: String, trim: true },
    url: { type: String, trim: true },
    meta: { type: Object, default: {} },
  },
  { _id: false }
);

const LessonSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      index: true,
      unique: false,
      sparse: true,
    },

    description: {
      type: String,
      trim: true,
    },

    content: {
      type: String, // HTML or Markdown
    },

    resources: {
      type: [ResourceSchema],
      default: [],
    },

    order: {
      type: Number,
      default: 0,
      index: true,
    },

    duration: {
      // seconds
      type: Number,
      default: 0,
      min: 0,
    },

    isDraft: {
      type: Boolean,
      default: true,
    },

    publishedAt: Date,

    // who created/last updated
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    meta: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

LessonSchema.pre("save", function (next) {
  if (!this.slug && this.title) {
    this.slug = `${this.title.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 80)}-${this._id?.toString?.().slice(-6) ?? ""}`;
  }
  next();
});

// After saving a lesson → increment lessonsCount in Course
LessonSchema.post("save", async function (doc) {
  if (doc.course) {
    await mongoose.model("Course").findByIdAndUpdate(doc.course, {
      $inc: { lessonsCount: 1 },
    });
  }
});

// After removing a lesson → decrement lessonsCount
LessonSchema.post("findOneAndDelete", async function (doc) {
  if (doc?.course) {
    await mongoose.model("Course").findByIdAndUpdate(doc.course, {
      $inc: { lessonsCount: -1 },
    });
  }
});


export default mongoose.model("Lesson", LessonSchema);