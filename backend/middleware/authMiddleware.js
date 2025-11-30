import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

/**
 * Middleware to protect routes.
 * Checks for a valid JWT in the Authorization header or cookie.
 * Sets req.user to the authenticated user.
 */
export const requireAuth = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Try Authorization header
    const header = req.headers.authorization;
    if (header?.startsWith?.("Bearer ")) {
      token = header.split(" ")[1];
    }

    // 2️⃣ Fallback to cookie
    if (!token) token = req.cookies?.refreshToken;

    if (!token) return res.status(401).json({ message: "No token provided" });

    let payload;

    try {
      payload = jwt.verify(token, JWT_SECRET); // access token
    } catch {
      try {
        payload = jwt.verify(token, REFRESH_SECRET); // refresh token fallback
      } catch {
        return res.status(401).json({ message: "Invalid token" });
      }
    }

    const user = await User.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ message: "Unauthorized" });

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
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Access denied: teacher only" });
  }
  next();
};

/**
 * NEW: Middleware to check if the authenticated user is a student.
 * Must be used after `protect`.
 */
export const isStudent = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Access denied: student only" });
  }
  next();
};

/**
 * Middleware to check if the authenticated user is an admin.
 * Must be used after `protect`.
 */
export const isAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: admin only" });
  }
  next();
};