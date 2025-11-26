import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./routes/auth.js";
import paymentsRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/admin.js";
import coursesRoutes from "./routes/courseRoutes.js";
import { createSocketServer } from "./sockets/index.js";

dotenv.config();

const app = express();

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_BASE || "https://mern-final-project-puritized-1.onrender.com"
];

// CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow server-to-server or Postman requests
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS not allowed: " + origin));
  },
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Mount API routes
app.use("/auth", authRoutes);
app.use("/payments", paymentsRoutes);
app.use("/admin", adminRoutes);
app.use("/api/courses", coursesRoutes);

// Test route
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Serve React SPA (production build)
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// SPA fallback: serve index.html for any non-API route
app.get("*", (req, res) => {
  if (req.path.startsWith("/api") || req.path.startsWith("/auth") || req.path.startsWith("/payments") || req.path.startsWith("/admin")) {
    return res.status(404).json({ message: "API route not found" });
  }
  res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
});

// HTTP server
const httpServer = http.createServer(app);

// Socket.io server
const io = createSocketServer(httpServer);

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});