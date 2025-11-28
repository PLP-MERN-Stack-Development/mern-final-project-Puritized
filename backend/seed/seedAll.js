import mongoose from "mongoose";
import dotenv from "dotenv";
import slugify from "slugify"; // ✅ install with: npm i slugify
dotenv.config();

import User from "../models/userModel.js";
import Course from "../models/courseModel.js";
import Lesson from "../models/lessonModel.js";
import Enrollment from "../models/enrollmentModel.js";
import Review from "../models/reviewModel.js";
import Payment from "../models/paymentModel.js";

const MONGO_URI = process.env.MONGO_URI;

async function seedAll() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected!");

    // ✅ Clear existing data (ADMIN REMAINS)
    await Course.deleteMany();
    await Lesson.deleteMany();
    await Enrollment.deleteMany();
    await Review.deleteMany();
    await Payment.deleteMany();
    await User.deleteMany({ role: { $ne: "admin" } });

    console.log("✅ Old data cleared (Admin preserved).");

    // ✅ Get Existing Admin
    const admin = await User.findOne({ role: "admin" });
    if (!admin) throw new Error("❌ No admin found! Please create admin first.");

    // ✅ ONE TEACHER
    const teacher = await User.create({
      name: "John Teacher",
      email: "teacher@example.com",
      password: "password123",
      role: "teacher",
    });

    // ✅ ONE STUDENT
    const student = await User.create({
      name: "Jane Student",
      email: "student@example.com",
      password: "password123",
      role: "student",
    });

    console.log("✅ Admin, Teacher & Student ready!");

    // ✅ 10 COURSES with unique slugs
    const coursesData = Array.from({ length: 10 }).map((_, i) => {
      const title = `Professional Course ${i + 1}`;
      return {
        title,
        slug: slugify(title, { lower: true, strict: true }),
        description: `Complete training for skill ${i + 1}`,
        teacher: teacher._id,
        price: 15000 + i * 2000,
        category: i % 2 === 0 ? "Business" : "Technology",
        isPublished: true,
      };
    });

    const courses = await Course.insertMany(coursesData);
    console.log("✅ 10 Courses created!");

    // ✅ Lessons for each course
    const lessonsData = courses.map((course, i) => ({
      course: course._id,
      title: `Lesson 1 - ${course.title}`,
      content: "This is a full lesson content.",
      author: teacher._id,
      isDraft: false,
    }));

    await Lesson.insertMany(lessonsData);
    console.log("✅ Lessons created!");

    // ✅ Student Enrolls in 5 Courses
    const enrollmentsData = courses.slice(0, 5).map((course, i) => ({
      student: student._id,
      course: course._id,
      progress: (i + 1) * 15,
    }));

    await Enrollment.insertMany(enrollmentsData);
    console.log("✅ Enrollments created!");

    // ✅ Reviews
    const reviewsData = courses.slice(0, 5).map((course, i) => ({
      student: student._id,
      course: course._id,
      rating: 4 + (i % 2),
      comment: `Very good course ${i + 1}`,
    }));

    await Review.insertMany(reviewsData);
    console.log("✅ Reviews added!");

    // ✅ PAYMENTS (Completed + Pending)
    const paymentsData = courses.slice(0, 5).map((course, i) => ({
      user: student._id,
      course: course._id,
      amount: course.price,
      paymentMethod: "paystack",
      reference: `REF-${Date.now()}-${i}`,
      status: i % 2 === 0 ? "completed" : "pending",
      createdAt: new Date(Date.now() - i * 86400000),
    }));

    await Payment.insertMany(paymentsData);
    console.log("✅ Payments created!");

    console.log("🎉 FULL LMS DATABASE SEEDED SUCCESSFULLY!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding Error:", error.message);
    process.exit(1);
  }
}

seedAll();