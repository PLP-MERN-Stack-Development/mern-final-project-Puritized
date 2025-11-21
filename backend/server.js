import express from 'express';
import http from 'http';
import 'dotenv/config'; // simplest way
// OR
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';

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

dotenv.config();
connectDB();

const app = express();

/* ------------------------------------------
   MIDDLEWARE
------------------------------------------- */

// JSON parser (exclude webhook)
app.use((req, res, next) => {
  if (req.originalUrl.includes("/api/payments/webhook")) {
    next(); // Stripe/Paystack require raw body
  } else {
    express.json()(req, res, next);
  }
});

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(cookieParser());

/* ------------------------------------------
   ROOT ROUTE (for testing)
------------------------------------------- */
app.get('/', (req, res) => {
  res.send('🚀 Server is running! Welcome to Puritized API.');
});

/* ------------------------------------------
   ROUTES
------------------------------------------- */

// AUTH ROUTES
app.use('/routes/auth', authRoutes);
app.use('/routes/auth/refresh', refreshRoutes);

// PLATFORM FEATURE ROUTES
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

// Attach Socket.io server
const io = attachSocket(server);

server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT} with Socket.io`)
);