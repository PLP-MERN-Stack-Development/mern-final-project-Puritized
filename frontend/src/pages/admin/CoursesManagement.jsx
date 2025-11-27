import React, { useEffect, useState } from "react";
import {
  fetchCoursesAdmin,
  publishCourse,
  unpublishCourse,
  deleteCourseAdmin
} from "../../api/adminApi";

export default function CoursesManagement() {
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const res = await fetchCoursesAdmin(p);
      setCourses(res.data.courses || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(page); }, [page]);

  const togglePublish = async (id, isPublished) => {
    try {
      if (isPublished) await unpublishCourse(id);
      else await publishCourse(id);
      setCourses(prev => prev.map(c => c._id === id ? { ...c, isPublished: !isPublished } : c));
    } catch (err) {
      console.error(err);
      alert("Could not update course");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete course?")) return;
    try {
      await deleteCourseAdmin(id);
      setCourses(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="pt-24 p-6 md:ml-64">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Courses Management</h1>

        {loading ? <p>Loading...</p> : (
          <div className="grid gap-4">
            {courses.map(c => (
              <div key={c._id} className="p-4 bg-white shadow rounded flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="text-sm text-muted-foreground">{c.shortDescription}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => togglePublish(c._id, c.isPublished)} className="btn btn-sm">
                    {c.isPublished ? "Unpublish" : "Publish"}
                  </button>
                  <button onClick={() => handleDelete(c._id)} className="btn btn-danger btn-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}