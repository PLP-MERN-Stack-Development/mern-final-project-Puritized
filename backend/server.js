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

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_BASE || "http://localhost:5173", credentials: true }));

// mount routes (prefix with /routes to match frontend axios paths)
app.use("/routes/auth", authRoutes);
app.use("/routes/payments", paymentsRoutes);
app.use("/routes/admin", adminRoutes);

// other routes...
app.get("/", (req, res) => res.json({ ok: true }));

const httpServer = http.createServer(app);

// Create socket.io server
const io = createSocketServer(httpServer);

// start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});