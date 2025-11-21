import React from 'react';
import Sidebar from '../components/Sidebar';

export default function AdminDashboard() {
  return (
    <div className="flex pt-16"> {/* Offset for Navbar */}
      <Sidebar />

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p>Manage courses, lessons, users, payments, and bookings here.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 border rounded shadow">Manage Courses</div>
          <div className="p-4 border rounded shadow">Manage Lessons</div>
          <div className="p-4 border rounded shadow">Manage Users</div>
          <div className="p-4 border rounded shadow">Manage Payments</div>
          <div className="p-4 border rounded shadow">Manage Bookings</div>
        </div>
      </main>
    </div>
  );
}