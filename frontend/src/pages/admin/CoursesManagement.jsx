import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchCoursesAdmin,
  publishCourse,
  unpublishCourse,
  deleteCourseAdmin
} from "../../api/adminApi";

export default function CoursesManagement() {
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const res = await fetchCoursesAdmin(p);
      console.log("Courses API response:", res.data);

      // ✅ 304/empty response protection
      if (!res || !res.data) {
        setCourses([]);
        setTotalPages(1);
        return;
      }

      const courseList = Array.isArray(res.data)
        ? res.data
        : res.data.courses || [];

      setCourses(courseList);
      if (res.data.totalPages) setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to load courses:", err);
      setCourses([]);
      alert("Failed to load courses. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(page);
  }, [page]);

  const togglePublish = async (id, isPublished) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      if (isPublished) await unpublishCourse(id);
      else await publishCourse(id);

      setCourses((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, isPublished: !isPublished } : c
        )
      );
    } catch (err) {
      console.error(err);
      alert("Could not update course");
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete course?")) return;

    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await deleteCourseAdmin(id);
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <div className="pt-24 p-6 md:ml-64">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Courses Management</h1>

        {loading ? (
          <p>Loading...</p>
        ) : courses.length > 0 ? (
          <>
            <div className="grid gap-4">
              {courses.map((c) => (
                <div
                  key={c._id}
                  className="p-4 bg-white shadow rounded flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">{c.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {c.shortDescription}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => togglePublish(c._id, c.isPublished)}
                      className="btn btn-sm"
                      disabled={actionLoading[c._id]}
                    >
                      {actionLoading[c._id]
                        ? "Updating..."
                        : c.isPublished
                        ? "Unpublish"
                        : "Publish"}
                    </button>

                    <button
                      onClick={() => handleDelete(c._id)}
                      className="btn btn-danger btn-sm"
                      disabled={actionLoading[c._id]}
                    >
                      {actionLoading[c._id] ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  className="btn btn-outline"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1 || loading}
                >
                  Previous
                </button>

                <span className="px-2 py-1 border rounded">
                  {page} / {totalPages}
                </span>

                <button
                  className="btn btn-outline"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages || loading}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500 mt-4">
            No courses found or failed to load.
          </p>
        )}
      </div>
    </div>
  );
}