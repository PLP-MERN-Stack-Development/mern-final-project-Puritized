import React, { useEffect, useState } from "react";
import api from "../../api/apiClient";
import { useParams } from "react-router-dom";

export default function StudentLessonPlayer() {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      const res = await api.get(`/api/teacher/lessons/${courseId}`);
      setLessons(res.data);
      setActiveLesson(res.data[0]);
    };

    fetchLessons();
  }, [courseId]);

  const markComplete = async (lessonId) => {
    await api.post("/api/progress/complete", {
      lessonId,
      courseId,
    });

    alert("Lesson marked complete ✅");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-4 gap-4">
        {/* Sidebar */}
        <div className="col-span-1 border p-4">
          {lessons.map((lesson) => (
            <div
              key={lesson._id}
              onClick={() => setActiveLesson(lesson)}
              className="cursor-pointer text-sm mb-2 hover:underline"
            >
              {lesson.title}
            </div>
          ))}
        </div>

        {/* Video Player */}
        <div className="col-span-3">
          {activeLesson && (
            <>
              <h2 className="text-xl font-bold mb-2">
                {activeLesson.title}
              </h2>

              {activeLesson.videoUrl && (
                <iframe
                  src={activeLesson.videoUrl}
                  className="w-full h-96 mb-4"
                  allowFullScreen
                />
              )}

              <div className="p-4 border mb-4">
                {activeLesson.content}
              </div>

              <button
                onClick={() => markComplete(activeLesson._id)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Mark as Completed
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}