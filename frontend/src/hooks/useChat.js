import { useEffect, useState } from "react";
import { socket } from "../services/socket";

export default function useChat(roomId) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit("joinRoom", roomId);

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [roomId]);

  const sendMessage = (data) => {
    socket.emit("sendMessage", data);
  };

  return { messages, sendMessage };
}