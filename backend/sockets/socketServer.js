import { Server as SocketIOServer } from 'socket.io';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import eventBus from '../utils/events.js';

const onlineUsers = new Map(); // track connected users

export default function attachSocket(server) {
  // Allow multiple origins (local dev + Render frontend)
  const allowedOrigins = [
    process.env.CLIENT_URL || '*',       // your deployed frontend on Render
    'http://localhost:5173',             // optional local dev Vite
    'http://localhost:3000'              // optional React dev
  ];

  const io = new SocketIOServer(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true
    },
    pingTimeout: 30000
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    /* --------------------------------------
       JOIN USER ROOM
    -----------------------------------------*/
    socket.on('join', ({ userId }) => {
      if (!userId) return;
      socket.join(userId);
      onlineUsers.set(userId, socket.id);
      io.emit('user:online', { userId, online: true });
    });

    /* --------------------------------------
       JOIN CONVERSATION
    -----------------------------------------*/
    socket.on('join:conversation', ({ conversationId }) => {
      if (!conversationId) return;
      socket.join(`conv_${conversationId}`);
    });

    /* --------------------------------------
       SEND MESSAGE
    -----------------------------------------*/
    socket.on('message:send', async ({ conversationId, sender, content, attachments = [] }) => {
      try {
        if (!conversationId || !sender || !content) return;

        const msg = await Message.create({
          conversation: conversationId,
          sender,
          content,
          attachments
        });

        const conv = await Conversation.findById(conversationId);
        if (!conv) return;

        const updates = {};
        conv.members.forEach((member) => {
          if (member.toString() !== sender.toString()) {
            updates[`unreadCounts.${member}`] = 1;
          }
        });

        await Conversation.findByIdAndUpdate(conversationId, {
          $set: { lastMessageAt: new Date() },
          $inc: updates
        });

        io.to(`conv_${conversationId}`).emit('message:received', msg);

        conv.members.forEach((userId) => {
          if (userId.toString() !== sender.toString()) {
            io.to(userId.toString()).emit('notification', {
              type: 'new_message',
              conversationId,
              message: msg
            });
          }
        });

        eventBus.emit('analytics:newMessage', { conversationId, sender });
      } catch (err) {
        console.error('Socket message error', err);
      }
    });

    /* --------------------------------------
       READ RECEIPTS
    -----------------------------------------*/
    socket.on('message:read', async ({ conversationId, userId }) => {
      try {
        await Conversation.findByIdAndUpdate(conversationId, {
          $set: { [`unreadCounts.${userId}`]: 0 }
        });

        io.to(`conv_${conversationId}`).emit('message:read:update', { conversationId, userId });
      } catch (e) {
        console.error('Read receipt error', e);
      }
    });

    /* --------------------------------------
       TYPING EVENTS
    -----------------------------------------*/
    socket.on('typing:start', ({ conversationId, userId }) => {
      io.to(`conv_${conversationId}`).emit('typing', { userId, typing: true });
    });

    socket.on('typing:stop', ({ conversationId, userId }) => {
      io.to(`conv_${conversationId}`).emit('typing', { userId, typing: false });
    });

    /* --------------------------------------
       DISCONNECT
    -----------------------------------------*/
    socket.on('disconnect', () => {
      for (const [uid, sid] of onlineUsers) {
        if (sid === socket.id) {
          onlineUsers.delete(uid);
          io.emit('user:online', { userId: uid, online: false });
          break;
        }
      }
    });
  });

  /* --------------------------------------
     GLOBAL EVENT BUS HOOKS
  -----------------------------------------*/
  eventBus.on('notification:send', ({ userId, payload }) => {
    io.to(userId).emit('notification', payload);
  });

  eventBus.on('payment:success', ({ bookingId, studentId, tutorId }) => {
    io.to(studentId).emit('payment:update', { bookingId, status: 'paid' });
    io.to(tutorId).emit('payment:update', { bookingId, status: 'paid' });
  });

  eventBus.on('booking:update', ({ userId, payload }) => {
    io.to(userId).emit('booking:update', payload);
  });

  eventBus.on('analytics:update', (data) => {
    io.to('admin_dashboard_room').emit('analytics:live', data);
  });

  return io;
}