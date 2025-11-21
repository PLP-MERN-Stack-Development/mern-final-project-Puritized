import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';

const socket = io('https://mern-final-project-puritized.onrender.com');

export default function ChatBox() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off('message');
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('message', { user: user.name, text: input });
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full border rounded p-4">
      <div className="flex-1 overflow-y-auto mb-2">
        {messages.map((msg, idx) => (
          <div key={idx} className="my-1">
            <strong>{msg.user}: </strong>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-1 border rounded px-2 py-1 mr-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}