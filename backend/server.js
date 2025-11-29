import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import coursesRoutes from "./routes/courseRoutes.js";
import authRoutes from "./routes/authRoutes.js"; 
import paymentsRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/admin.js";
import { createSocketServer } from "./sockets/index.js";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
connectDB();

const app = express();

/* ✅ CORS FIXED FOR PRODUCTION + DEV */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_BASE, // make sure FRONTEND_BASE is set in Render env
  "https://mern-final-project-puritized-1.onrender.com"
];

app.use(cors({
  origin: function(origin, callback) {
    // allow REST tools or server-to-server requests with no origin
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed: " + origin));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors()); // required for preflight requests

// Middleware
app.use(express.json());
app.use(cookieParser());

// API ROUTES
app.use("/api/courses", coursesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/admin", adminRoutes);

// Test route
app.get("/api/ping", (req, res) => res.json({ ok: true }));


// Frontend build serving

const __dirname = path.resolve();

// Serve React build
app.use(express.static(path.join(__dirname, "frontend/dist")));

// Catch-all route for React Router (FIXES /admin BLANK PAGE)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
});


// HTTP + SOCKET
const httpServer = http.createServer(app);
const io = createSocketServer(httpServer);

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`✅ Server listening on ${PORT}`);
});
