import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Courses from "../pages/Courses";
import CourseDetails from "../pages/CourseDetails";
import Dashboard from "../pages/Dashboard";

import AdminDashboard from "../pages/admin/AdminDashboard";
import CourseManagement from "../pages/admin/CourseManagement";
import UsersManagement from "../pages/admin/UsersManagement";
import PaymentsManagement from "../pages/admin/PaymentsManagement";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:id" element={<CourseDetails />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/courses" element={<CourseManagement />} />
      <Route path="/admin/users" element={<UsersManagement />} />
      <Route path="/admin/payments" element={<PaymentsManagement />} />

      {/* Protected User Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
