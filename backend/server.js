import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import paymentsRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/admin.js";
import { createSocketServer } from "./sockets/index.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://mern-final-project-puritized-1.onrender.com", // your deployed frontend
  process.env.FRONTEND_BASE, // optional: from env
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed: " + origin));
    }
  },
  credentials: true
}));

// mount routes
app.use("/routes/auth", authRoutes);
app.use("/routes/payments", paymentsRoutes);
app.use("/routes/admin", adminRoutes);

app.get("/", (req, res) => res.json({ ok: true }));

const httpServer = http.createServer(app);

// Create socket.io server
const io = createSocketServer(httpServer);

// start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});