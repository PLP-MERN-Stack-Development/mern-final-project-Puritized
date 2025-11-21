import React from 'react';
import Sidebar from '../components/Sidebar';
import { useCourses } from '../api/courses';

export default function Courses() {
  const { data: courses, isLoading } = useCourses();

  return (
    <div className="flex pt-16">
      <Sidebar />

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Courses</h1>

        {isLoading ? (
          <p>Loading courses...</p>
        ) : (
          <ul className="space-y-2">
            {courses?.map((course) => (
              <li key={course._id} className="p-4 border rounded hover:shadow-md">
                {course.title}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}