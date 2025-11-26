import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_EXPIRES = process.env.ACCESS_EXPIRES || "15m";
const REFRESH_EXPIRES = process.env.REFRESH_EXPIRES || "7d";
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function signAccess(user) {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: ACCESS_EXPIRES });
}
function signRefresh(user) {
  return jwt.sign({ id: user._id }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role = "student" } = req.body;
    if (!email || !password || !name) return res.status(400).json({ message: "Missing required fields" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already in use" });

    const user = new User({ name, email, password, role });
    await user.save();

    const accessToken = signAccess(user);
    const refreshToken = signRefresh(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    return res.status(201).json({ user: user.toJSON(), accessToken });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing credentials" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = signAccess(user);
    const refreshToken = signRefresh(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    return res.json({ user: user.toJSON(), accessToken });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const payload = jwt.verify(token, REFRESH_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: "Invalid refresh token" });

    if (user.refreshToken && user.refreshToken !== token) {
      return res.status(401).json({ message: "Refresh token mismatch" });
    }

    const accessToken = signAccess(user);
    return res.json({ accessToken, user: user.toJSON() });
  } catch (err) {
    console.error("refresh error", err?.message || err);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const me = async (req, res) => {
  // Return null user instead of 401 for public access
  return res.json({ user: req.user ? req.user.toJSON() : null });
};

export const logout = async (req, res) => {
  try {
    if (req.user) {
      req.user.refreshToken = null;
      await req.user.save();
    }
    res.clearCookie("refreshToken", COOKIE_OPTIONS);
    return res.json({ message: "Logged out" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Logout failed" });
  }
};