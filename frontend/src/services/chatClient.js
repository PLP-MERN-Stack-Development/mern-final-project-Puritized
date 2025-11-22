import { io } from 'socket.io-client';

let socket;

/* --------------------------------------
   Connect Socket.IO client with optional token
----------------------------------------*/
export const connectSocket = (token) => {
  if (socket) return socket; // prevent multiple connections

  socket = io(process.env.VITE_BACKEND_URL || 'https://mern-final-project-puritized.onrender.com', {
    withCredentials: true,
    auth: token ? { token } : undefined, // optional auth token
  });

  socket.on('connect', () => console.log('Socket connected:', socket.id));
  socket.on('disconnect', () => console.log('Socket disconnected'));

  return socket;
};

/* --------------------------------------
   Join a conversation room
----------------------------------------*/
export const joinConversation = (conversationId) => {
  if (!socket) return;
  socket.emit('join:conversation', { conversationId });
};

/* --------------------------------------
   Send message to a conversation
----------------------------------------*/
export const sendMessage = ({ conversationId, sender, content, attachments = [] }) => {
  if (!socket) return;
  socket.emit('message:send', { conversationId, sender, content, attachments });
};