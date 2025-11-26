import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware to protect routes.
 * Checks for a valid JWT in the Authorization header.
 * Sets req.user to the authenticated user.
 */
export const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith?.("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = header.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(payload.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("requireAuth:", err.message || err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// Alias for consistency
export const protect = requireAuth;

/**
 * Middleware to check if the authenticated user is a teacher.
 * Must be used after `protect`.
 */
export const isTeacher = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Access denied: teacher only" });
  }

  next();
};