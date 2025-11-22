import { useEffect, useState } from "react";
import socket from "../services/socket"; // default export from socket.js

export default function useChat(conversationId, userId) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!conversationId || !userId) return;

    // Connect socket and join conversation
    socket.connect();
    socket.emit("join", { userId });
    socket.emit("join:conversation", { conversationId });

    // Listen for incoming messages
    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };
    socket.on("message:received", handleMessage);

    // Cleanup on unmount
    return () => {
      socket.off("message:received", handleMessage);
      socket.disconnect();
    };
  }, [conversationId, userId]);

  const sendMessage = (content, attachments = []) => {
    if (!conversationId || !userId || !content) return;

    socket.emit("message:send", {
      conversationId,
      sender: userId,
      content,
      attachments,
    });
  };

  return { messages, sendMessage };
}