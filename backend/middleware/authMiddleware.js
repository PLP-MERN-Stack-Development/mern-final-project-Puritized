import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to require authentication
export const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith?.("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = header.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = user;
    next();
  } catch (err) {
    console.error("requireAuth:", err.message || err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// Alias for requireAuth (used in your imports)
export const protect = requireAuth;

// Middleware to check if user is a teacher
export const isTeacher = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Access denied, teacher only" });
  }
  next();
};