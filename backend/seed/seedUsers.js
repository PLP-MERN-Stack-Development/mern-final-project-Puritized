import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/userModel.js";

dotenv.config();

export async function seedUsers() {
  console.log("Seeding users...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  const users = [
    {
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    },
    {
      name: "Teacher One",
      email: "teacher1@example.com",
      password: hashedPassword,
      role: "teacher",
    },
    {
      name: "Teacher Two",
      email: "teacher2@example.com",
      password: hashedPassword,
      role: "teacher",
    },
    {
      name: "Student One",
      email: "student1@example.com",
      password: hashedPassword,
      role: "student",
    },
    {
      name: "Student Two",
      email: "student2@example.com",
      password: hashedPassword,
      role: "student",
    },
  ];

  await User.insertMany(users);
  console.log("Users seeded.");

  return users;
}