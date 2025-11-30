// backend/controllers/teacherController.js
import Course from "../models/courseModel.js";
import Enrollment from "../models/enrollmentModel.js";

/**
 * GET /api/teacher/courses
 * Return courses created by the authenticated teacher
 */
export const getTeacherCourses = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const courses = await Course.find({ instructor: teacherId }).sort({ createdAt: -1 });
    return res.json(courses);
  } catch (err) {
    console.error("getTeacherCourses:", err);
    return res.status(500).json({ message: "Failed to load courses" });
  }
};

/**
 * POST /api/teacher/courses
 * Create a course (teacher-only)
 */
export const createCourse = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { title, description, shortDescription, price, isPublished = false } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    const course = new Course({
      title,
      description,
      shortDescription,
      price: price || 0,
      instructor: teacherId,
      isPublished,
      createdAt: new Date(),
    });

    await course.save();
    return res.status(201).json(course);
  } catch (err) {
    console.error("createCourse:", err);
    return res.status(500).json({ message: "Create course failed" });
  }
};

/**
 * PATCH /api/teacher/courses/:id
 * Update course (only owner teacher)
 */
export const updateCourse = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { id } = req.params;
    const updates = req.body;

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (String(course.instructor) !== String(teacherId)) {
      return res.status(403).json({ message: "Not authorized to update this course" });
    }

    Object.assign(course, updates);
    course.updatedAt = new Date();
    await course.save();

    return res.json(course);
  } catch (err) {
    console.error("updateCourse:", err);
    return res.status(500).json({ message: "Update failed" });
  }
};

/**
 * DELETE /api/teacher/courses/:id
 * Delete course (only owner teacher)
 */
export const deleteCourse = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (String(course.instructor) !== String(teacherId)) {
      return res.status(403).json({ message: "Not authorized to delete this course" });
    }

    await course.remove();

    // Optionally cascade delete enrollments
    await Enrollment.deleteMany({ course: id });

    return res.json({ message: "Course deleted" });
  } catch (err) {
    console.error("deleteCourse:", err);
    return res.status(500).json({ message: "Delete failed" });
  }
};

/**
 * GET /api/teacher/courses/:id/students
 * List students enrolled in a teacher's course (only if teacher owns the course)
 */
export const getCourseStudents = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (String(course.instructor) !== String(teacherId)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const enrollments = await Enrollment.find({ course: id }).populate("user", "name email");
    return res.json({ students: enrollments });
  } catch (err) {
    console.error("getCourseStudents:", err);
    return res.status(500).json({ message: "Failed to load students" });
  }
};