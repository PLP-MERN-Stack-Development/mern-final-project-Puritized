import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Message from "../models/messageModel.js"; // optional model to persist messages
import User from "../models/userModel.js";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export function createSocketServer(httpServer, options = {}) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_BASE || "*",
      credentials: true,
    },
    ...options,
  });

  // Auth middleware for sockets
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers["authorization"]?.split(" ")[1];
      if (!token) return next(new Error("auth error"));
      const payload = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(payload.id).select("-password");
      if (!user) return next(new Error("auth error"));
      socket.user = user;
      next();
    } catch (err) {
      next(new Error("auth error"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();
    // join personal room
    socket.join(`user:${userId}`);

    // optional: user-level presence broadcast
    io.emit("presence:update", { userId, status: "online" });

    // join conversation rooms when requested
    socket.on("conversation:join", (conversationId) => {
      socket.join(`conversation:${conversationId}`);
    });

    // message send
    socket.on("message:send", async (payload) => {
      try {
        // payload: { conversationId, content, metadata }
        const message = {
          conversationId: payload.conversationId || "default",
          sender: socket.user._id,
          senderName: socket.user.name,
          content: payload.content,
          createdAt: new Date(),
          meta: payload.meta || {},
        };

        // persist if model exists
        try {
          const m = await Message.create(message);
          // emit saved message
          io.to(`conversation:${message.conversationId}`).emit("message:received", m);
        } catch (e) {
          // if no persistence, emit plain object
          io.to(`conversation:${message.conversationId}`).emit("message:received", message);
        }
      } catch (err) {
        console.error("socket message error", err);
      }
    });

    socket.on("disconnect", () => {
      io.emit("presence:update", { userId, status: "offline" });
    });
  });

  return io;
}