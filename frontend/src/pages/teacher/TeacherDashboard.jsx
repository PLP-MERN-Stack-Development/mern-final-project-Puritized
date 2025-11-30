import React, { useEffect, useState } from "react";
import api from "../../api/apiClient";

export default function TeacherDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newCourse, setNewCourse] = useState({ title: "", shortDescription: "" });
  const [showCreate, setShowCreate] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [newLesson, setNewLesson] = useState({ title: "", content: "" });
  const [studentsProgress, setStudentsProgress] = useState([]);

  /* ================= FETCH TEACHER COURSES ================= */
  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        setLoading(true);
        setError("");
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

  /* ================= CREATE COURSE ================= */
  const handleCreateCourse = async () => {
    try {
      const res = await api.post("/api/teacher/courses", newCourse);
      setCourses((prev) => [...prev, res.data]);
      setNewCourse({ title: "", shortDescription: "" });
      setShowCreate(false);
    } catch (err) {
      console.error("Create course error:", err);
      alert("Failed to create course.");
    }
  };

  /* ================= SELECT COURSE ================= */
  const selectCourse = async (course) => {
    setSelectedCourse(course);

    // Fetch lessons
    try {
      const res = await api.get(`/api/teacher/courses/${course._id}/lessons`);
      setLessons(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch lessons error:", err);
      setLessons([]);
    }

    // Fetch students progress
    fetchStudentsProgress(course._id);
  };

  const fetchStudentsProgress = async (courseId) => {
    try {
      const res = await api.get(`/api/teacher/courses/${courseId}/students/progress`);
      setStudentsProgress(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch students progress error:", err);
      setStudentsProgress([]);
    }
  };

  /* ================= ADD LESSON ================= */
  const addLesson = async () => {
    if (!selectedCourse) return;
    try {
      const res = await api.post(`/api/teacher/courses/${selectedCourse._id}/lessons`, newLesson);
      setLessons((prev) => [...prev, res.data]);
      setNewLesson({ title: "", content: "" });
    } catch (err) {
      console.error("Add lesson error:", err);
      alert("Failed to add lesson.");
    }
  };

  /* ================= MARK LESSON COMPLETE ================= */
  const markLessonComplete = async (studentId, lessonId) => {
    if (!selectedCourse) return;
    try {
      await api.post(
        `/api/teacher/courses/${selectedCourse._id}/students/${studentId}/lessons/${lessonId}/complete`
      );
      fetchStudentsProgress(selectedCourse._id); // refresh progress
    } catch (err) {
      console.error("Mark complete error:", err);
      alert("Failed to mark lesson complete.");
    }
  };

  return (
    <div className="pt-24 p-6 md:ml-64 min-h-screen bg-background">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Teacher Dashboard</h1>
        <p className="text-muted-foreground mb-6">
          Create courses, manage lessons, and track student progress
        </p>

        {/* ================= CREATE COURSE ================= */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {showCreate ? "Cancel" : "Create New Course"}
          </button>

          {showCreate && (
            <div className="mt-4 p-4 bg-white shadow rounded flex flex-col gap-2">
              <input
                type="text"
                placeholder="Course Title"
                className="border p-2 rounded"
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
              />
              <textarea
                placeholder="Short Description"
                className="border p-2 rounded"
                value={newCourse.shortDescription}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, shortDescription: e.target.value })
                }
              />
              <button
                onClick={handleCreateCourse}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save Course
              </button>
            </div>
          )}
        </div>

        {/* ================= COURSES LIST ================= */}
        {loading && <div>Loading your courses...</div>}
        {!loading && error && <div className="text-red-600">{error}</div>}
        {!loading && !error && courses.length === 0 && <div>No courses yet.</div>}

        {!loading && !error && courses.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {courses.map((course) => (
              <div
                key={course._id}
                className="p-4 border rounded bg-white shadow flex flex-col gap-2"
              >
                <h3 className="font-bold">{course.title}</h3>
                <p className="text-sm text-muted-foreground">{course.shortDescription}</p>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                    onClick={() => selectCourse(course)}
                  >
                    Manage Course
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= SELECTED COURSE DETAILS ================= */}
        {selectedCourse && (
          <div className="mt-8 p-6 bg-white shadow rounded">
            <h2 className="font-semibold text-xl mb-2">{selectedCourse.title}</h2>

            {/* ===== Lessons Management ===== */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Lessons</h3>
              {lessons.map((lesson) => (
                <div key={lesson._id} className="p-2 border-b flex justify-between">
                  <span>{lesson.title}</span>
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Lesson Title"
                  className="border p-2 rounded flex-1"
                  value={newLesson.title}
                  onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Content URL / Description"
                  className="border p-2 rounded flex-1"
                  value={newLesson.content}
                  onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                />
                <button
                  onClick={addLesson}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Add Lesson
                </button>
              </div>
            </div>

            {/* ===== Students Progress ===== */}
            <div>
              <h3 className="font-semibold mb-2">Students Progress</h3>
              {studentsProgress.length === 0 && <p>No students enrolled yet.</p>}
              {studentsProgress.length > 0 && (
                <table className="w-full text-sm border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-2 py-1">Student</th>
                      <th className="border px-2 py-1">Lessons Completed</th>
                      <th className="border px-2 py-1">Progress %</th>
                      <th className="border px-2 py-1">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentsProgress.map((s) => (
                      <tr key={s._id}>
                        <td className="border px-2 py-1">{s.name}</td>
                        <td className="border px-2 py-1">{s.completedLessons}</td>
                        <td className="border px-2 py-1">{s.progress}%</td>
                        <td className="border px-2 py-1 flex gap-1 flex-wrap">
                          {lessons.map((lesson) => (
                            <button
                              key={lesson._id}
                              onClick={() => markLessonComplete(s._id, lesson._id)}
                              className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                            >
                              Mark "{lesson.title}" Complete
                            </button>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}