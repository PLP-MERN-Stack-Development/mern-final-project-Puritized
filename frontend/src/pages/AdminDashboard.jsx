import React from 'react';
import Sidebar from '../components/Sidebar';

export default function AdminDashboard() {
  return (
    <div className="flex pt-16"> {/* Offset for Navbar */}
      <Sidebar />

      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-gray-700 mb-6">
          Manage courses, lessons, users, payments, and bookings here.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border rounded shadow hover:shadow-lg transition">
            Manage Courses
          </div>
          <div className="p-6 border rounded shadow hover:shadow-lg transition">
            Manage Lessons
          </div>
          <div className="p-6 border rounded shadow hover:shadow-lg transition">
            Manage Users
          </div>
          <div className="p-6 border rounded shadow hover:shadow-lg transition">
            Manage Payments
          </div>
          <div className="p-6 border rounded shadow hover:shadow-lg transition">
            Manage Bookings
          </div>
        </div>
      </main>
    </div>
  );
}