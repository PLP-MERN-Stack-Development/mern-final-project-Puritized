import React, { useState, useEffect } from 'react';
import socket, { connectSocket } from '../utils/socket';
import { useAuth } from '../contexts/AuthContext';

export default function ChatBox() {
  const { user, loading } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // Connect socket when user is available
  useEffect(() => {
    if (!loading && user?.id) {
      connectSocket(user.id);

      socket.on('message:received', (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    }

    return () => {
      socket.off('message:received');
    };
  }, [user, loading]);

  const sendMessage = () => {
    if (input.trim() && user?.id) {
      socket.emit('message:send', {
        conversationId: 'default', // Replace with actual conversationId if needed
        sender: user.id,
        content: input,
      });
      setInput('');
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading chat...</p>;
  }

  if (!user) {
    return <p className="text-red-500">Please log in to chat.</p>;
  }

  return (
    <div className="flex flex-col h-full border rounded p-4">
      <div className="flex-1 overflow-y-auto mb-2">
        {messages.map((msg, idx) => (
          <div key={idx} className="my-1">
            <strong>{msg.senderName || 'User'}: </strong>
            {msg.content}
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