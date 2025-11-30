import Progress from "../models/progressModel.js";
import Lesson from "../models/lessonModel.js";

export const markLessonComplete = async (req, res) => {
  try {
    const { lessonId, courseId } = req.body;

    let progress = await Progress.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (!progress) {
      progress = await Progress.create({
        student: req.user._id,
        course: courseId,
        completedLessons: [lessonId],
      });
    } else {
      if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
      }
    }

    const totalLessons = await Lesson.countDocuments({ course: courseId });

    progress.progressPercent = Math.round(
      (progress.completedLessons.length / totalLessons) * 100
    );

    await progress.save();

    res.json(progress);
  } catch (err) {
    console.error("markLessonComplete:", err);
    res.status(500).json({ message: "Progress update failed" });
  }
};

export const getStudentProgress = async (req, res) => {
  const progress = await Progress.find({
    student: req.user._id,
  }).populate("course");

  res.json(progress);
};