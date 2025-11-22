import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar() {
  const { user } = useAuth(); // Can be used to show/hide links based on auth

  return (
    <aside className="w-64 h-screen bg-gray-100 shadow-md p-4">
      <ul className="space-y-3">
        <li>
          <Link to="/" className="hover:text-blue-500">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/courses" className="hover:text-blue-500">
            Courses
          </Link>
        </li>
        <li>
          <Link to="/lessons" className="hover:text-blue-500">
            Lessons
          </Link>
        </li>
        {user && (
          <>
            <li>
              <Link to="/bookings" className="hover:text-blue-500">
                Bookings
              </Link>
            </li>
            <li>
              <Link to="/payments" className="hover:text-blue-500">
                Payments
              </Link>
            </li>
            <li>
              <Link to="/chat" className="hover:text-blue-500">
                Chat
              </Link>
            </li>
          </>
        )}
      </ul>
    </aside>
  );
}