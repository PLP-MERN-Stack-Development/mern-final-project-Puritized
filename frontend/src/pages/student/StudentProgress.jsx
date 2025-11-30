import React, { useEffect, useState } from "react";
import api from "../../api/apiClient";

export default function StudentProgress() {
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    const fetchProgress = async () => {
      const res = await api.get("/api/progress");
      setProgress(res.data);
    };

    fetchProgress();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">My Progress</h2>

      {progress.map((p) => (
        <div key={p._id} className="p-4 border mb-3 rounded">
          <h3 className="font-bold">{p.course.title}</h3>
          <p className="text-sm mt-1">
            Progress: {p.progressPercent}%
          </p>
          <div className="h-2 bg-gray-200 rounded mt-2">
            <div
              style={{ width: `${p.progressPercent}%` }}
              className="h-2 bg-black rounded"
            />
          </div>
        </div>
      ))}
    </div>
  );
}