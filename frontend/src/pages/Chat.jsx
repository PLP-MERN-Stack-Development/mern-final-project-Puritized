import React from 'react';
import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox';

export default function Chat() {
  return (
    <div className="flex pt-16">
      <Sidebar />

      <main className="flex-1 p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-4">Chat</h1>
        <div className="flex-1">
          <ChatBox />
        </div>
      </main>
    </div>
  );
}