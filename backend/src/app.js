import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courseRoutes.js';
import userRoutes from './routes/users.js';
import bookingRoutes from './routes/bookingRoutes.js';
import messagesRoutes from './routes/messageRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();
const app = express();

// security
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || true }));
app.use(express.json({ limit: '10mb' }));

// rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

// logging
app.use(morgan('combined'));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/messages', messagesRoutes);

// health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// error handler (last)
app.use(errorHandler);

export default app;