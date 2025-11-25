import React from 'react';

export default function TeacherDashboard() {
  return (
    <div className="pt-24 p-6 md:ml-64">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
        <p className="text-muted-foreground mb-6">Create lessons and manage students</p>

        <div className="grid grid-cols-1 gap-6">
          <div className="card">My Courses</div>
        </div>
      </div>
    </div>
  );
}