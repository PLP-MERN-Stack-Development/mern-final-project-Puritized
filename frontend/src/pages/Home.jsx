import React, { useEffect, useState } from 'react';
import api, { makePublic } from '../api/apiClient';
import { Link } from 'react-router-dom';

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use the "public" wrapper to skip auth redirect
    api.get('/api/courses', makePublic())
      .then(res => setCourses(res.data || []))
      .catch(err => {
        console.error('Failed to load courses:', err);
        setCourses([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-20">
      <header className="bg-blue-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold">EduBridge — Quality Online Learning</h1>
          <p className="mt-2">Courses by expert instructors. Learn anywhere, anytime.</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Featured Courses</h2>

          {loading ? (
            <p>Loading courses...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.length === 0 ? (
                <p className="text-muted-foreground">No courses yet</p>
              ) : (
                courses.map(c => (
                  <div key={c._id} className="card border p-4 rounded shadow">
                    <h3 className="text-lg font-semibold">{c.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{c.description}</p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-sm font-medium">${c.price ?? 0}</span>
                      <Link className="text-blue-600 text-sm" to={`/courses/${c._id}`}>View</Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}