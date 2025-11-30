import React, { useEffect, useState } from "react";
import api from "../../api/apiClient";

export default function StudentDashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH ENROLLMENTS ================= */
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        setError("");

        // Token is already handled by apiClient interceptor
        const res = await api.get("/api/student/enrollments");

        setEnrollments(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Student enrollments error:", err);
        setError("Failed to load your enrolled courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  /* ================= UNENROLL ================= */
  const handleUnenroll = async (id) => {
    if (!window.confirm("Are you sure you want to unenroll?")) return;

    try {
      await api.delete(`/api/student/enroll/${id}`);
      setEnrollments((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Unenroll failed:", err);
      alert("Failed to unenroll. Try again.");
    }
  };

  return (
    <div className="pt-24 p-6 md:ml-64 min-h-screen bg-background">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">My Courses</h1>
        <p className="text-muted-foreground mb-6">
          Your enrolled courses
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
        {!loading && !error && enrollments.length === 0 && (
          <div className="p-6 rounded-lg border bg-white shadow text-center">
            You are not enrolled in any course yet.
          </div>
        )}

        {/* ================= ENROLLED COURSES ================= */}
        {!loading && !error && enrollments.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {enrollments.map((item) => (
              <div
                key={item._id}
                className="p-6 rounded-lg border bg-white shadow flex flex-col gap-2"
              >
                <h3 className="text-lg font-bold">
                  {item.course?.title || "Untitled Course"}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {item.course?.shortDescription || "No description available"}
                </p>

                <div className="text-xs text-gray-500">
                  Instructor:{" "}
                  {item.course?.instructor?.name || "Not assigned"}
                </div>

                <div className="text-xs text-gray-500">
                  Progress: {item.progress || 0}%
                </div>

                <div className="mt-3 flex gap-3">
                  <button
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Continue Learning
                  </button>

                  <button
                    onClick={() => handleUnenroll(item._id)}
                    className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Unenroll
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