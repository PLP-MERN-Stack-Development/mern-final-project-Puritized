import React from 'react';
import Sidebar from '../components/Sidebar';
import { useLessons } from '../api/lessons';

export default function Lessons() {
  const { data: lessons, isLoading } = useLessons();

  return (
    <div className="flex pt-16 min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Lessons</h1>

        {isLoading ? (
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
      </main>
    </div>
  );
}