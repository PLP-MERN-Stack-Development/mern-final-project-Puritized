import React from 'react';
import Sidebar from '../components/Sidebar';
import { useCourses } from '../api/courses';
import { useLessons } from '../api/lessons';

export default function Dashboard() {
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: lessons, isLoading: lessonsLoading } = useLessons();

  return (
    <div className="flex pt-16 min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* Courses Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Courses</h2>
          {coursesLoading ? (
            <p>Loading courses...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses?.map((course) => (
                <div
                  key={course._id}
                  className="p-4 border rounded shadow hover:shadow-lg transition-shadow bg-white"
                >
                  <h3 className="text-lg font-semibold">{course.title}</h3>
                  {course.description && (
                    <p className="text-gray-600 mt-2 text-sm">{course.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Lessons Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Lessons</h2>
          {lessonsLoading ? (
            <p>Loading lessons...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lessons?.map((lesson) => (
                <div
                  key={lesson._id}
                  className="p-4 border rounded shadow hover:shadow-lg transition-shadow bg-white"
                >
                  <h3 className="text-lg font-semibold">{lesson.title}</h3>
                  {lesson.description && (
                    <p className="text-gray-600 mt-2 text-sm">{lesson.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}