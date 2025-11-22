import React from 'react';
import Sidebar from '../components/Sidebar';
import { useCourses } from '../api/courses';

export default function Courses() {
  const { data: courses, isLoading } = useCourses();

  return (
    <div className="flex pt-16 min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Courses</h1>

        {isLoading ? (
          <p>Loading courses...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses?.map((course) => (
              <div
                key={course._id}
                className="p-4 border rounded shadow hover:shadow-lg transition-shadow bg-white"
              >
                <h2 className="text-lg font-semibold">{course.title}</h2>
                {course.description && (
                  <p className="text-sm text-gray-600 mt-2">{course.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}