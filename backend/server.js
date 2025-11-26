import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import coursesRoutes from "./routes/courseRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // FIXED
import paymentsRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/admin.js";
import { createSocketServer } from "./sockets/index.js";

dotenv.config();

const app = express();

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://mern-final-project-puritized-1.onrender.com",
  process.env.FRONTEND_BASE,
];

// CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed: " + origin));
      }
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// API ROUTES (CORRECT)
app.use("/api/courses", coursesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/admin", adminRoutes);

// Test route
app.get("/", (req, res) => res.json({ ok: true }));

// HTTP + SOCKET
const httpServer = http.createServer(app);
const io = createSocketServer(httpServer);

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`✅ Server listening on ${PORT}`);
});