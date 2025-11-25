import React, { useEffect, useState } from 'react';
import { getCourses } from '../api/courseApi';
import { Link } from 'react-router-dom';

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  useEffect(()=>{ getCourses().then(r=>setCourses(r.data || [])); }, []);
  return (
    <div className="pt-24 p-6 md:ml-64 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map(c => (
          <div key={c._id} className="card">
            <h3 className="font-semibold">{c.title}</h3>
            <p className="text-sm text-muted-foreground">{c.description}</p>
            <div className="mt-3 flex justify-between">
              <span>${c.price ?? 0}</span>
              <Link to={`/courses/${c._id}`} className="text-blue-600">View</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}