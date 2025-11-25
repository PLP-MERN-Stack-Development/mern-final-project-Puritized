import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import User from "../models/userModel.js";
import Course from "../models/courseModel.js";
import Lesson from "../models/lessonModel.js";
import Enrollment from "../models/enrollmentModel.js";
import Review from "../models/reviewModel.js";

const MONGO_URI = process.env.MONGO_URI;

async function seedAll() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected!");

    // Clear existing data
    await User.deleteMany();
    await Course.deleteMany();
    await Lesson.deleteMany();
    await Enrollment.deleteMany();
    await Review.deleteMany();

    console.log("Old data cleared.");

    // Admin
    const admin = await User.create({
      name: "Super Admin",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
    });

    // Teachers
    const teachers = await User.insertMany([
      { name: "Teacher One", email: "teacher1@example.com", password: "password123", role: "teacher" },
      { name: "Teacher Two", email: "teacher2@example.com", password: "password123", role: "teacher" },
    ]);

    // Students
    const students = await User.insertMany([
      { name: "Student Alpha", email: "student1@example.com", password: "password123", role: "student" },
      { name: "Student Beta", email: "student2@example.com", password: "password123", role: "student" },
      { name: "Student Gamma", email: "student3@example.com", password: "password123", role: "student" },
    ]);

    console.log("Users created!");

    // Courses
    const courses = await Course.insertMany([
      {
        title: "Introduction to Business",
        description: "Foundational course on business strategy.",
        teacher: teachers[0]._id,
        price: 30,
        category: "Business",
        isPublished: true,
      },
      {
        title: "Web Development Basics",
        description: "Learn HTML, CSS, JavaScript",
        teacher: teachers[1]._id,
        price: 45,
        category: "Technology",
        isPublished: true,
      },
    ]);

    console.log("Courses created!");

    // Lessons
    const lessons = await Lesson.insertMany([
      {
        course: courses[0]._id,
        title: "What is Business?",
        content: "HTML or Markdown content...",
        author: teachers[0]._id,
        isDraft: false,
      },
      {
        course: courses[0]._id,
        title: "Types of Business",
        content: "More course content...",
        author: teachers[0]._id,
        isDraft: false,
      },
      {
        course: courses[1]._id,
        title: "Introduction to HTML",
        content: "Deep dive into HTML...",
        author: teachers[1]._id,
        isDraft: false,
      },
    ]);

    console.log("Lessons created!");

    // Enroll students in courses
    const enrollments = await Enrollment.insertMany([
      { student: students[0]._id, course: courses[0]._id, progress: 20 },
      { student: students[1]._id, course: courses[0]._id, progress: 0 },
      { student: students[2]._id, course: courses[1]._id, progress: 10 },
    ]);

    console.log("Enrollments created!");

    // Add some reviews
    const reviews = await Review.insertMany([
      { student: students[0]._id, course: courses[0]._id, rating: 4, comment: "Very helpful!" },
      { student: students[1]._id, course: courses[0]._id, rating: 5, comment: "Excellent course!" },
      { student: students[2]._id, course: courses[1]._id, rating: 5, comment: "Great intro to coding!" },
    ]);

    console.log("Reviews created!");

    console.log("🎉 LMS Seeding Completed Successfully!");
    process.exit();
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
}

seedAll();