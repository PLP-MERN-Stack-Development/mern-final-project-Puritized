import { io } from 'socket.io-client';
let socket;

export const connectSocket = (token) => {
  socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
    auth: { token } // optional: pass token then server must verify
  });

  socket.on('connect', () => console.log('socket connected', socket.id));
  socket.on('disconnect', () => console.log('socket disconnected'));
  return socket;
};

export const joinConversation = (conversationId) => socket.emit('join:conversation', { conversationId });

export const sendMessage = ({ conversationId, sender, content }) =>
  socket.emit('message:send', { conversationId, sender, content });