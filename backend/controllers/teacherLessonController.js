import Lesson from "../models/lessonModel.js";
import Course from "../models/courseModel.js";

/**
 * GET /api/teacher/lessons/:courseId
 */
export const getLessons = async (req, res) => {
  try {
    const { courseId } = req.params;

    const lessons = await Lesson.find({ course: courseId }).sort({ order: 1 });

    res.json(lessons);
  } catch (err) {
    console.error("getLessons:", err);
    res.status(500).json({ message: "Failed to load lessons" });
  }
};

/**
 * POST /api/teacher/lessons
 */
export const createLesson = async (req, res) => {
  try {
    const { title, videoUrl, content, courseId, order } = req.body;

    if (!title || !courseId) {
      return res.status(400).json({ message: "Title and Course required" });
    }

    const course = await Course.findById(courseId);

    if (!course) return res.status(404).json({ message: "Course not found" });

    if (String(course.instructor) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not your course" });
    }

    const lesson = await Lesson.create({
      title,
      videoUrl,
      content,
      course: courseId,
      order,
    });

    res.status(201).json(lesson);
  } catch (err) {
    console.error("createLesson:", err);
    res.status(500).json({ message: "Failed to create lesson" });
  }
};

/**
 * PATCH /api/teacher/lessons/:id
 */
export const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate("course");

    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    if (String(lesson.course.instructor) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(lesson, req.body);
    await lesson.save();

    res.json(lesson);
  } catch (err) {
    console.error("updateLesson:", err);
    res.status(500).json({ message: "Lesson update failed" });
  }
};

/**
 * DELETE /api/teacher/lessons/:id
 */
export const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate("course");

    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    if (String(lesson.course.instructor) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await lesson.deleteOne();

    res.json({ message: "Lesson deleted" });
  } catch (err) {
    console.error("deleteLesson:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};