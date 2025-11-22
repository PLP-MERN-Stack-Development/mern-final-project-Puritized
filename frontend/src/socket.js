import { io } from 'socket.io-client';

// Backend URL from environment variable or fallback
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://mern-final-project-puritized.onrender.com';

const socket = io(BACKEND_URL, {
  withCredentials: true,
  autoConnect: false, // connect manually
  transports: ['websocket', 'polling'], // fallback for Render environments
});

export function connectSocket(userId) {
  if (!userId) return;
  
  if (!socket.connected) {
    socket.connect();
  }
  
  socket.emit('join', { userId });
}

// Optional: helper to disconnect safely
export function disconnectSocket() {
  if (socket.connected) {
    socket.disconnect();
  }
}

export default socket;