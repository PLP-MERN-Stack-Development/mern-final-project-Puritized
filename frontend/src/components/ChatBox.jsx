import React, { useState, useEffect, useRef } from "react";
import { socket } from "../services/socket.js";
import { useAuth } from "../contexts/AuthContext";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

export default function ChatBox() {
  const { user, loading } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!loading && user?.id) {
      socket.on("message:received", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    }

    return () => {
      socket.off("message:received");
    };
  }, [user, loading]);

  // Auto-scroll on message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() && user?.id) {
      socket.emit("message:send", {
        conversationId: "default",
        sender: user.id,
        senderName: user.name || "You",
        content: input,
      });
      setInput("");
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading chat...</p>;
  }

  if (!user) {
    return <p className="text-red-500">Please log in to chat.</p>;
  }

  return (
    <Card className="w-full h-full flex flex-col border shadow-md">
      <CardHeader>
        <h2 className="text-xl font-semibold">Chat Box</h2>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto space-y-3 p-4 bg-muted/30 rounded-lg">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl max-w-[70%] ${
              msg.sender === user.id
                ? "bg-primary text-primary-foreground ml-auto"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            <p className="text-xs font-semibold mb-1">
              {msg.senderName || "User"}
            </p>
            <p>{msg.content}</p>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </CardContent>

      <CardFooter className="flex gap-2 pt-2">
        <Input
          placeholder="Type a message..."
          className="flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <Button onClick={sendMessage} disabled={!input.trim()}>
          Send
        </Button>
      </CardFooter>
    </Card>
  );
}