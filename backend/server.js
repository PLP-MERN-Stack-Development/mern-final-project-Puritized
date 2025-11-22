import express from 'express';
import http from 'http';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import jwt from 'jsonwebtoken';

// AUTH & REFRESH
import authRoutes from './routes/auth.js';
import refreshRoutes from './routes/refresh.js';

// NEW PLATFORM ROUTES
import courseRoutes from "./routes/courseRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

import errorHandler from './middleware/errorHandler.js';

// SOCKET.IO
import attachSocket from './sockets/socketServer.js';

import User from './models/User.js'; // required for /me route

connectDB();

const app = express();

/* ------------------------------------------
   MIDDLEWARE
------------------------------------------- */

// JSON parser (exclude webhook)
app.use((req, res, next) => {
  if (req.originalUrl.includes("/api/payments/webhook")) {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// CORS for both REST API and Socket.io
const allowedOrigins = [
  process.env.CLIENT_URL, // frontend URL from .env (Render)
  'http://localhost:5173', // optional local dev
  'http://localhost:3000'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(cookieParser());

/* ------------------------------------------
   AUTHENTICATION MIDDLEWARE
------------------------------------------- */
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1]; // Bearer <token>
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

/* ------------------------------------------
   ROOT ROUTE
------------------------------------------- */
app.get('/', (req, res) => {
  res.send('🚀 Server is running! Welcome to Puritized API.');
});

/* ------------------------------------------
   CURRENT USER ROUTE (/me)
------------------------------------------- */
app.get('/routes/auth/me', requireAuth, async (req, res) => {
  try {
    return res.json({ user: req.user.toJSON() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/* ------------------------------------------
   ROUTES
------------------------------------------- */
app.use('/routes/auth', authRoutes);
app.use('/routes/auth/refresh', refreshRoutes);

app.use("/routes/courses", courseRoutes);
app.use("/routes/lessons", lessonRoutes);
app.use("/routes/bookings", bookingRoutes);
app.use("/routes/chat", chatRoutes);
app.use("/routes/payments", paymentRoutes);
app.use("/routes/reviews", reviewRoutes);
app.use("/routes/notifications", notificationRoutes);
app.use("/routes/analytics", analyticsRoutes);

/* ------------------------------------------
   ERROR HANDLER
------------------------------------------- */
app.use(errorHandler);

/* ------------------------------------------
   SERVER START WITH SOCKET.IO
------------------------------------------- */
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Attach Socket.io with CORS config
const io = attachSocket(server, allowedOrigins);

server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT} with Socket.io`)
);