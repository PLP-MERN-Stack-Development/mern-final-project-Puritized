import React, { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa6';
import axios from 'axios';
import socket from '../utils/socket'; // make sure this points to your socket.js
import { useAuth } from '../contexts/AuthContext';

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Fetch initial notifications from backend
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          'https://mern-final-project-puritized.onrender.com/routes/notifications',
          { withCredentials: true }
        );
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();

    // Connect to Socket.io and join user room
    socket.connect();
    socket.emit('join', { userId: user._id });

    // Listen for new notifications
    socket.on('notification', (payload) => {
      setNotifications((prev) => [payload, ...prev]);
    });

    return () => {
      socket.off('notification');
      socket.disconnect();
    };
  }, [user]);

  return (
    <div className="relative">
      <FaBell size={20} className="cursor-pointer" />
      {notifications.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
          {notifications.length}
        </span>
      )}
    </div>
  );
}