import React from 'react';
import { Link } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        EduBridge - E-Learning Marketplace (SDG4)
      </Link>

      <div className="flex items-center space-x-4">
        <Link to="/courses" className="hover:text-blue-500">
          Courses
        </Link>
        <Link to="/lessons" className="hover:text-blue-500">
          Lessons
        </Link>
        <Link to="/chat" className="hover:text-blue-500">
          Chat
        </Link>

        <NotificationBell />

        {user ? (
          <button
            onClick={logout}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}