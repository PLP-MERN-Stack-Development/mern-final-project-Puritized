import React, { useEffect, useState } from 'react';
import { getCourses } from '../api/courseApi';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getCourses()
      .then(r => setCourses(r.data || []))
      .catch(() => setCourses([]));
  }, []);

  return (
    <div className="pt-20">
      <header className="bg-blue-600 text-white py-12 flex justify-between items-center">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold">EduBridge — Quality Online Learning</h1>
          <p className="mt-2">Courses by expert instructors. Learn anywhere, anytime.</p>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold mr-4"
        >
          Login
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Featured courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.length === 0 ? (
              <p className="text-muted-foreground">No courses yet</p>
            ) : (
              courses.map(c => (
                <div key={c._id} className="card">
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
        </section>
      </main>
    </div>
  );
}