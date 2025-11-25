import Course from "../models/courseModel.js";
import Lesson from "../models/lessonModel.js";
import mongoose from "mongoose";

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
    const courses = await Course.find().populate("tutor", "name email");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get single course
export const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("lessons");
    res.json(course);
  } catch (err) {
    res.status(404).json({ message: "Course not found" });
  }
};

// @desc Update a course
export const updateCourse = async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc Delete a course
export const deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    await Lesson.deleteMany({ course: req.params.id });
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};