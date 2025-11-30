// backend/controllers/studentController.js
import Enrollment from "../models/enrollmentModel.js";
import Course from "../models/courseModel.js";

/**
 * GET /api/student/enrollments
 * List enrollments for authenticated student
 */
export const getEnrollments = async (req, res) => {
  try {
    const studentId = req.user._id;

    const enrollments = await Enrollment.find({ user: studentId })
      .populate({
        path: "course",
        select: "title shortDescription price instructor isPublished",
        populate: { path: "instructor", select: "name email" },
      })
      .sort({ createdAt: -1 });

    return res.json(enrollments);
  } catch (err) {
    console.error("getEnrollments:", err);
    return res.status(500).json({ message: "Failed to load enrollments" });
  }
};

/**
 * POST /api/student/enroll
 * Enroll the authenticated student into a course
 * body: { courseId }
 */
export const enrollCourse = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { courseId } = req.body;

    if (!courseId) return res.status(400).json({ message: "courseId required" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (!course.isPublished)
      return res.status(400).json({ message: "Course not published" });

    // Prevent duplicate enrollments
    const existing = await Enrollment.findOne({
      course: courseId,
      user: studentId,
    });

    if (existing)
      return res.status(409).json({ message: "Already enrolled" });

    const enrollment = new Enrollment({
      user: studentId,
      course: courseId,
      progress: 0,
      createdAt: new Date(),
    });

    await enrollment.save();

    return res.status(201).json(enrollment);
  } catch (err) {
    console.error("enrollCourse:", err);
    return res.status(500).json({ message: "Enrollment failed" });
  }
};

/**
 * DELETE /api/student/enroll/:id
 * Unenroll (student can remove own enrollment)
 */
export const unenroll = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { id } = req.params; // enrollment id

    const enrollment = await Enrollment.findById(id);
    if (!enrollment)
      return res.status(404).json({ message: "Enrollment not found" });

    if (String(enrollment.user) !== String(studentId)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // PRODUCTION FIX: remove() is deprecated
    await Enrollment.deleteOne({ _id: id });

    return res.json({ message: "Unenrolled" });
  } catch (err) {
    console.error("unenroll:", err);
    return res.status(500).json({ message: "Unenroll failed" });
  }
};