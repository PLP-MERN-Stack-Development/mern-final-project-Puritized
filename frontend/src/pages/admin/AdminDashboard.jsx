import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api/apiClient";

export default function AdminDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await api.get("/api/admin/summary");
        setStats(res.data);
      } catch (err) {
        console.error("Admin stats error:", err);
        setError("Failed to load admin summary");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return <div className="pt-24 text-center">Loading admin dashboard...</div>;
  }

  if (error) {
    return (
      <div className="pt-24 text-center text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="pt-24 p-6 md:ml-64 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}
          </p>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* USERS */}
          <div className="card p-6 bg-white shadow rounded-xl">
            <h3 className="text-sm text-muted-foreground mb-1">
              Total Users
            </h3>
            <p className="text-3xl font-bold">
              {stats?.users || 0}
            </p>
          </div>

          {/* COURSES */}
          <div className="card p-6 bg-white shadow rounded-xl">
            <h3 className="text-sm text-muted-foreground mb-1">
              Total Courses
            </h3>
            <p className="text-3xl font-bold">
              {stats?.courses || 0}
            </p>
          </div>

          {/* PAYMENTS */}
          <div className="card p-6 bg-white shadow rounded-xl">
            <h3 className="text-sm text-muted-foreground mb-1">
              Total Revenue
            </h3>
            <p className="text-3xl font-bold">
              ${stats?.totalRevenue || 0}
            </p>
          </div>
        </div>

        {/* RECENT DATA */}
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          {/* RECENT USERS */}
          <div className="bg-white p-6 shadow rounded-xl">
            <h2 className="font-semibold mb-4">Recent Users</h2>

            {stats?.recentUsers?.length === 0 ? (
              <p className="text-muted-foreground">No recent users</p>
            ) : (
              <ul className="space-y-3">
                {stats.recentUsers.map((u) => (
                  <li
                    key={u._id}
                    className="flex justify-between text-sm border-b pb-2"
                  >
                    <span>{u.name}</span>
                    <span className="text-muted-foreground">
                      {u.role}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* RECENT PAYMENTS */}
          <div className="bg-white p-6 shadow rounded-xl">
            <h2 className="font-semibold mb-4">Recent Payments</h2>

            {stats?.recentPayments?.length === 0 ? (
              <p className="text-muted-foreground">No recent payments</p>
            ) : (
              <ul className="space-y-3">
                {stats.recentPayments.map((p) => (
                  <li
                    key={p._id}
                    className="flex justify-between text-sm border-b pb-2"
                  >
                    <span>{p.email}</span>
                    <span className="font-semibold">
                      ${p.amount}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}