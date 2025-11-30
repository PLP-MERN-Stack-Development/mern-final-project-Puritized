import React, { useEffect, useState } from "react";
import api from "../../api/apiClient";

export default function TeacherLessons({ courseId }) {
  const [lessons, setLessons] = useState([]);
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [content, setContent] = useState("");

  const fetchLessons = async () => {
    const res = await api.get(`/api/teacher/lessons/${courseId}`);
    setLessons(res.data);
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const createLesson = async () => {
    await api.post("/api/teacher/lessons", {
      title,
      videoUrl,
      content,
      courseId,
    });

    setTitle("");
    setVideoUrl("");
    setContent("");
    fetchLessons();
  };

  const deleteLesson = async (id) => {
    await api.delete(`/api/teacher/lessons/${id}`);
    fetchLessons();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Lessons</h2>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Lesson Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-2"
        placeholder="Video URL"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />

      <textarea
        className="border p-2 w-full mb-2"
        placeholder="Lesson Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        onClick={createLesson}
        className="bg-black text-white px-4 py-2 rounded mb-6"
      >
        Add Lesson
      </button>

      {lessons.map((lesson) => (
        <div
          key={lesson._id}
          className="p-4 border rounded mb-3 bg-white"
        >
          <h3 className="font-bold">{lesson.title}</h3>
          <button
            onClick={() => deleteLesson(lesson._id)}
            className="text-red-600 text-sm mt-2"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}