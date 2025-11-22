import React, { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa6';
import axios from 'axios';
import { socket } from '../services/socket.js';
import { useAuth } from '../contexts/AuthContext';

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Fetch initial notifications
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

    // Join Socket.io user room
    socket.emit('join', { userId: user.id });

    // Listen for new notifications
    socket.on('notification', (payload) => {
      setNotifications((prev) => [payload, ...prev]);
    });

    return () => {
      socket.off('notification');
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