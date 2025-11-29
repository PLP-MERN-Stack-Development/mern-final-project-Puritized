import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api/apiClient";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { user } = useAuth();

  // ✅ FIX: stats must always be an object
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    pendingPayments: 0,
    completedPayments: 0,
    revenueLast30: 0,
  });

  const [revenue, setRevenue] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [
          summaryRes,
          revenueRes,
          usersRes,
          coursesRes,
          paymentsRes,
        ] = await Promise.all([
          api.get("/api/admin/summary"),
          api.get("/api/admin/revenue"),
          api.get("/api/admin/users"),
          api.get("/api/admin/courses"),
          api.get("/api/admin/payments"),
        ]);

        setStats(summaryRes.data || stats);

        // ✅ FIX: ALWAYS FORCE ARRAYS
        setRevenue(Array.isArray(revenueRes.data?.data) ? revenueRes.data.data : []);
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
        setCourses(Array.isArray(coursesRes.data) ? coursesRes.data : []);
        setPayments(Array.isArray(paymentsRes.data) ? paymentsRes.data : []);
      } catch (err) {
        console.error("Admin dashboard error:", err);
        setError("Failed to load admin dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  /* ================= ACTION HANDLERS ================= */

  const updateRole = async (id, role) => {
    await api.patch(`/api/admin/users/${id}/role`, { role });
    setUsers((prev) =>
      prev.map((u) => (u._id === id ? { ...u, role } : u))
    );
  };

  const deleteUser = async (id) => {
    await api.delete(`/api/admin/users/${id}`);
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  const publishCourse = async (id) => {
    await api.post(`/api/admin/courses/${id}/publish`);
    setCourses((prev) =>
      prev.map((c) => (c._id === id ? { ...c, isPublished: true } : c))
    );
  };

  const unpublishCourse = async (id) => {
    await api.post(`/api/admin/courses/${id}/unpublish`);
    setCourses((prev) =>
      prev.map((c) => (c._id === id ? { ...c, isPublished: false } : c))
    );
  };

  const deleteCourse = async (id) => {
    await api.delete(`/api/admin/courses/${id}`);
    setCourses((prev) => prev.filter((c) => c._id !== id));
  };

  const downloadCSV = (data, filename) => {
    if (!Array.isArray(data) || data.length === 0) return;

    const csv =
      Object.keys(data[0]).join(",") +
      "\n" +
      data.map((row) => Object.values(row).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  if (loading) return <div className="pt-24 text-center">Loading admin...</div>;
  if (error)
    return (
      <div className="pt-24 text-center text-red-600 font-semibold">{error}</div>
    );

  return (
    <div className="pt-24 p-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}</p>
        </div>

        <div className="flex flex-wrap gap-4 mb-10">
  <Link
    to="/users"
    className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
  >
    Manage Users
  </Link>

  <Link
    to="/courses"
    className="px-5 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
  >
    Manage Courses
  </Link>

  <Link
    to="/admin/payments"
    className="px-5 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700"
  >
    Manage Payments
  </Link>
</div>

        {/* ✅ STATS SAFE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard title="Users" value={stats.totalUsers} />
          <DashboardCard title="Students" value={stats.totalStudents} />
          <DashboardCard title="Teachers" value={stats.totalTeachers} />
          <DashboardCard title="Courses" value={stats.totalCourses} />
          <DashboardCard title="Enrollments" value={stats.totalEnrollments} />
          <DashboardCard title="Pending Payments" value={stats.pendingPayments} />
          <DashboardCard title="Completed Payments" value={stats.completedPayments} />
          <DashboardCard title="Revenue (30 Days)" value={`₦${stats.revenueLast30}`} />
        </div>

        <Section title="Revenue History">
          <table className="w-full text-sm">
            <tbody>
              {Array.isArray(revenue) &&
                revenue.map((r) => (
                  <tr key={r._id}>
                    <td>{r._id}</td>
                    <td>{r.count}</td>
                    <td>₦{r.total}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Section>
      </div>
    </div>
  );
}

function DashboardCard({ title, value }) {
  return (
    <div className="p-6 bg-white shadow rounded-xl text-center">
      <h3 className="text-sm text-muted-foreground mb-1">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white p-6 shadow rounded-xl mt-10">
      <h2 className="font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}
