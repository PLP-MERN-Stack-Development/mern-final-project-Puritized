import Course from "../models/courseModel.js";
import Lesson from "../models/lessonModel.js";

// @desc Create a course
export const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc Get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("teacher", "name email"); // ✅ correct field

    res.json(courses);
  } catch (err) {
    console.error("getCourses error:", err);
    res.status(500).json({ message: err.message });
  }
};

// @desc Get single course WITH lessons
export const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("teacher", "name email"); // ✅ correct field

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // ✅ Fetch lessons properly (since Course has no lessons array)
    const lessons = await Lesson.find({ course: course._id }).sort({ order: 1 });

    res.json({
      ...course.toObject(),
      lessons, // ✅ manually attached
    });
  } catch (err) {
    console.error("getCourse error:", err);
    res.status(400).json({ message: "Invalid course ID" });
  }
};

// @desc Update a course
export const updateCourse = async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("teacher", "name email");

    if (!updated) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc Delete a course + its lessons
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await Lesson.deleteMany({ course: course._id });

    res.json({ message: "Course deleted" });
  } catch (err) {
    console.error("deleteCourse error:", err);
    res.status(500).json({ message: err.message });
  }
};