import http from 'http';
import app from './app.js';
import { connectDB } from './config/db.js';
import socketHandler from './sockets/socket.js';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 4000;

await connectDB(process.env.MONGO_URI);

const server = http.createServer(app);

// attach socket.io
socketHandler(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});