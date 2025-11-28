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

/* FIXED CORS — THIS SOLVES YOUR PRODUCTION ERROR */
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://mern-final-project-puritized-1.onrender.com"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors()); //  REQUIRED for preflight requests

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

// HTTP + SOCKET
const httpServer = http.createServer(app);
const io = createSocketServer(httpServer);

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`✅ Server listening on ${PORT}`);
});

// Frontend build serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Fix React routes (catch-all) — only for non-API requests
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});