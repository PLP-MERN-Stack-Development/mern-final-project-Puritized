import React, { useEffect, useState } from 'react';
import { getCourse } from '../api/courseApi';
import { useParams, useNavigate } from 'react-router-dom';

export default function CourseDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const [course, setCourse] = useState(null);

  useEffect(()=> {
    if (!id) return;
    getCourse(id).then(r => setCourse(r.data)).catch(()=> setCourse(null));
  }, [id]);

  if (!course) return <div className="pt-24 p-6 md:ml-64">Loading...</div>;

  return (
    <div className="pt-24 p-6 md:ml-64 max-w-5xl mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <p className="text-muted-foreground mt-2">{course.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-lg font-semibold">${course.price ?? 0}</div>
          <button onClick={()=> nav(`/checkout/${course._id}`)} className="btn">Buy Course</button>
        </div>
      </div>
    </div>
  );
}