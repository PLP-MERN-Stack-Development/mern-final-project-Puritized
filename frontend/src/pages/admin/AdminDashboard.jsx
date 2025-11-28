import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api/apiClient";

export default function AdminDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
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

        setStats(summaryRes.data);
        setRevenue(revenueRes.data.data || []);
        setUsers(usersRes.data || []);
        setCourses(coursesRes.data || []);
        setPayments(paymentsRes.data || []);
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

        {/* ✅ HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}</p>
        </div>

        {/* ✅ STATS */}
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

        {/* ✅ REVENUE TABLE */}
        <Section title="Revenue History">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th>Date</th>
                <th>Transactions</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {revenue.map((r) => (
                <tr key={r._id} className="border-b">
                  <td>{r._id}</td>
                  <td>{r.count}</td>
                  <td>₦{r.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        {/* ✅ USERS 관리 */}
        <Section title="Users Management">
          <button
            onClick={() => downloadCSV(users, "users.csv")}
            className="mb-3 btn"
          >
            Download Users
          </button>

          {users.map((u) => (
            <div key={u._id} className="flex justify-between border-b py-2">
              <span>{u.name} — {u.role}</span>
              <div className="space-x-2">
                <select
                  value={u.role}
                  onChange={(e) => updateRole(u._id, e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
                <button onClick={() => deleteUser(u._id)}>❌</button>
              </div>
            </div>
          ))}
        </Section>

        {/* ✅ COURSES 관리 */}
        <Section title="Courses Management">
          {courses.map((c) => (
            <div key={c._id} className="flex justify-between border-b py-2">
              <span>{c.title}</span>
              <div className="space-x-2">
                {c.isPublished ? (
                  <button onClick={() => unpublishCourse(c._id)}>Unpublish</button>
                ) : (
                  <button onClick={() => publishCourse(c._id)}>Publish</button>
                )}
                <button onClick={() => deleteCourse(c._id)}>❌</button>
              </div>
            </div>
          ))}
        </Section>

        {/* ✅ PAYMENTS */}
        <Section title="Payments">
          <button
            onClick={() => downloadCSV(payments, "payments.csv")}
            className="mb-3 btn"
          >
            Download Payments
          </button>

          {payments.map((p) => (
            <div key={p._id} className="flex justify-between border-b py-2">
              <span>{p.email}</span>
              <span>₦{p.amount}</span>
            </div>
          ))}
        </Section>

      </div>
    </div>
  );
}

/* ✅ COMPONENTS */

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