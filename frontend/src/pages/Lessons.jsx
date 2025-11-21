import React from 'react';
import Sidebar from '../components/Sidebar';
import { useLessons } from '../api/lessons';

export default function Lessons() {
  const { data: lessons, isLoading } = useLessons();

  return (
    <div className="flex pt-16">
      <Sidebar />

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Lessons</h1>

        {isLoading ? (
          <p>Loading lessons...</p>
        ) : (
          <ul className="space-y-2">
            {lessons?.map((lesson) => (
              <li key={lesson._id} className="p-4 border rounded hover:shadow-md">
                {lesson.title}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}