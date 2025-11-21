import React from 'react';
import Sidebar from '../components/Sidebar';
import { useCourses } from '../api/courses';
import { useLessons } from '../api/lessons';

export default function Dashboard() {
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: lessons, isLoading: lessonsLoading } = useLessons();

  return (
    <div className="flex pt-16"> {/* pt-16 to offset Navbar height */}
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Courses</h2>
          {coursesLoading ? (
            <p>Loading courses...</p>
          ) : (
            <ul className="space-y-1">
              {courses?.map((course) => (
                <li key={course._id} className="p-2 border rounded">
                  {course.title}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Lessons</h2>
          {lessonsLoading ? (
            <p>Loading lessons...</p>
          ) : (
            <ul className="space-y-1">
              {lessons?.map((lesson) => (
                <li key={lesson._id} className="p-2 border rounded">
                  {lesson.title}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}