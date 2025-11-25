import React from 'react';

export default function AdminDashboard() {
  return (
    <div className="pt-24 p-6 md:ml-64">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-6">Overview and management</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card">Users & stats</div>
          <div className="card">Payments</div>
          <div className="card">Courses</div>
        </div>
      </div>
    </div>
  );
}