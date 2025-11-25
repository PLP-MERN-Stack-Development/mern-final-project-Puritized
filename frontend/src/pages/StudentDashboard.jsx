import React from 'react';

export default function StudentDashboard() {
  return (
    <div className="pt-24 p-6 md:ml-64">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">My Courses</h1>
        <p className="text-muted-foreground mb-6">Your enrolled courses</p>

        <div className="grid grid-cols-1 gap-6">
          <div className="card">Enrolled course list</div>
        </div>
      </div>
    </div>
  );
}