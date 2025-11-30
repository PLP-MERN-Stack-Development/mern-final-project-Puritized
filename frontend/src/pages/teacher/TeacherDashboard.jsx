import React, { useEffect, useState } from "react";
import api from "../../api/apiClient";

export default function TeacherDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH TEACHER COURSES ================= */
  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        setLoading(true);
        setError("");

        // ✅ Token handled automatically by apiClient
        const res = await api.get("/api/teacher/courses");

        setCourses(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Teacher courses error:", err);
        setError("Failed to load your courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  return (
    <div className="pt-24 p-6 md:ml-64 min-h-screen bg-background">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Teacher Dashboard</h1>
        <p className="text-muted-foreground mb-6">
          Create lessons and manage students
        </p>

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="p-6 rounded-lg border bg-white shadow text-center">
            Loading your courses...
          </div>
        )}

        {/* ================= ERROR ================= */}
        {!loading && error && (
          <div className="p-6 rounded-lg border bg-red-50 text-red-600 shadow text-center">
            {error}
          </div>
        )}

        {/* ================= EMPTY ================= */}
        {!loading && !error && courses.length === 0 && (
          <div className="p-6 rounded-lg border bg-white shadow text-center">
            You have not created any courses yet.
          </div>
        )}

        {/* ================= COURSES LIST ================= */}
        {!loading && !error && courses.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="p-6 rounded-lg border bg-white shadow flex flex-col gap-2"
              >
                <h3 className="text-lg font-bold">
                  {course.title || "Untitled Course"}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {course.shortDescription || "No description provided"}
                </p>

                <div className="text-xs text-gray-500">
                  Students Enrolled: {course.students?.length || 0}
                </div>

                <div className="mt-3 flex gap-3">
                  <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                    Manage Lessons
                  </button>

                  <button className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                    View Students
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}