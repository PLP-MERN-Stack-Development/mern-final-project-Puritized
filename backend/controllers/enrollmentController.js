// backend/controllers/enrollmentController.js
import Enrollment from "../models/enrollmentModel.js";
import Course from "../models/courseModel.js";

/* ============================
   ENROLL IN COURSE (Student)
=============================== */
export const enroll = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Prevent repeat enrollment
    const existing = await Enrollment.findOne({
      student: req.user._id,
      course: course._id,
    });

    if (existing) return res.json({ message: "Already enrolled" });

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: course._id,
    });

    res.status(201).json(enrollment);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ============================
   GET STUDENT ENROLLMENTS
=============================== */
export const getMyEnrollments = async (req, res) => {
  try {
    const items = await Enrollment.find({ student: req.user._id }).populate("course");
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};