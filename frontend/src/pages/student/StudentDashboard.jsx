import React, { useEffect, useState } from "react";
import api from "../../api/apiClient";

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);          // All courses
  const [enrollments, setEnrollments] = useState([]);  // Student's enrolled courses
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH ALL COURSES & ENROLLMENTS ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [coursesRes, enrollmentsRes] = await Promise.all([
          api.get("/api/courses"),               // All available courses
          api.get("/api/student/enrollments"),   // Enrolled courses
        ]);

        setCourses(Array.isArray(coursesRes.data) ? coursesRes.data : []);
        setEnrollments(Array.isArray(enrollmentsRes.data) ? enrollmentsRes.data : []);
      } catch (err) {
        console.error("Student dashboard fetch error:", err);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ================= ENROLL IN COURSE ================= */
  const handleEnroll = async (courseId) => {
    try {
      const res = await api.post(`/api/student/enroll/${courseId}`);
      setEnrollments((prev) => [...prev, res.data]);
      alert("Enrolled successfully!");
    } catch (err) {
      console.error("Enroll error:", err);
      alert("Failed to enroll. Try again.");
    }
  };

  /* ================= UNENROLL ================= */
  const handleUnenroll = async (enrollmentId) => {
    if (!window.confirm("Are you sure you want to unenroll?")) return;

    try {
      await api.delete(`/api/student/enroll/${enrollmentId}`);
      setEnrollments((prev) => prev.filter((e) => e._id !== enrollmentId));
    } catch (err) {
      console.error("Unenroll failed:", err);
      alert("Failed to unenroll. Try again.");
    }
  };

  /* ================= SELECT COURSE & LOAD LESSONS ================= */
  const selectCourse = async (course) => {
    setSelectedCourse(course);
    try {
      const res = await api.get(`/api/student/courses/${course._id}/lessons`);
      setLessons(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch lessons error:", err);
      setLessons([]);
    }
  };

  /* ================= MARK LESSON COMPLETE ================= */
  const markLessonComplete = async (courseId, lessonId) => {
    try {
      await api.post(`/api/student/courses/${courseId}/lessons/${lessonId}/complete`);
      // Refresh progress
      const res = await api.get("/api/student/enrollments");
      setEnrollments(Array.isArray(res.data) ? res.data : []);
      alert("Lesson marked complete!");
    } catch (err) {
      console.error("Mark lesson complete error:", err);
      alert("Failed to update progress.");
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="pt-24 p-6 md:ml-64 min-h-screen bg-background">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Student Dashboard</h1>
        <p className="text-muted-foreground mb-6">
          Browse courses, enroll, and track your learning progress
        </p>

        {loading && <div>Loading courses...</div>}
        {!loading && error && <div className="text-red-600">{error}</div>}

        {/* ================= ALL COURSES ================= */}
        <h2 className="font-semibold mb-2 mt-6">Available Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {courses.map((course) => {
            const enrolled = enrollments.some((e) => e.course._id === course._id);
            return (
              <div
                key={course._id}
                className="p-4 border rounded bg-white shadow flex flex-col gap-2"
              >
                <h3 className="font-bold">{course.title}</h3>
                <p className="text-sm text-muted-foreground">{course.shortDescription}</p>
                <div className="flex gap-2">
                  {enrolled ? (
                    <button
                      onClick={() => selectCourse(course)}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Open Course
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEnroll(course._id)}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Enroll
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= ENROLLED COURSES ================= */}
        <h2 className="font-semibold mb-2 mt-6">My Enrolled Courses</h2>
        {enrollments.length === 0 && <p>You have not enrolled in any courses yet.</p>}
        {enrollments.map((item) => (
          <div
            key={item._id}
            className="p-4 border rounded bg-white shadow flex flex-col gap-2 mb-2"
          >
            <h3 className="font-bold">{item.course.title}</h3>
            <p className="text-sm text-muted-foreground">{item.course.shortDescription}</p>
            <div className="text-xs text-gray-500">
              Instructor: {item.course.instructor?.name || "Not assigned"}
            </div>
            <div className="text-xs text-gray-500">Progress: {item.progress || 0}%</div>

            <div className="flex gap-2 mt-2">
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded"
                onClick={() => selectCourse(item.course)}
              >
                Continue Learning
              </button>
              <button
                onClick={() => handleUnenroll(item._id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Unenroll
              </button>
            </div>
          </div>
        ))}

        {/* ================= SELECTED COURSE LESSONS ================= */}
        {selectedCourse && (
          <div className="mt-8 p-6 bg-white shadow rounded">
            <h2 className="font-semibold text-xl mb-2">{selectedCourse.title} - Lessons</h2>
            {lessons.length === 0 && <p>No lessons yet.</p>}
            {lessons.map((lesson) => (
              <div
                key={lesson._id}
                className="p-2 border-b flex justify-between items-center"
              >
                <span>{lesson.title}</span>
                <button
                  onClick={() => markLessonComplete(selectedCourse._id, lesson._id)}
                  className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                >
                  Mark Complete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}