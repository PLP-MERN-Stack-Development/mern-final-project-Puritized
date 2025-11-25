import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import paymentsRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/admin.js";
import coursesRoutes from "./routes/courses.js"; // add if you have a courses route
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
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS not allowed: " + origin));
  },
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Mount routes with correct paths
app.use("/auth", authRoutes);
app.use("/payments", paymentsRoutes);
app.use("/admin", adminRoutes);
app.use("/api/courses", coursesRoutes); // frontend calls /api/courses

// Test route
app.get("/", (req, res) => res.json({ ok: true }));

// HTTP server
const httpServer = http.createServer(app);

// Socket.io server
const io = createSocketServer(httpServer);

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});