import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  fetchUsers,
  updateUserRole,
  deleteUser
} from "../../api/adminApi";

export default function UsersManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const res = await fetchUsers(p);
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(page); }, [page]);

  const handleRole = async (id, role) => {
    try {
      await updateUserRole(id, role);
      setUsers((prev) => prev.map(u => u._id === id ? { ...u, role } : u));
    } catch (err) {
      console.error(err);
      alert("Could not update role");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete user?")) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter(u => u._id !== id));
    } catch (err) {
      console.error(err);
      alert("Could not delete user");
    }
  };

  return (
    <div className="pt-24 p-6 md:ml-64">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Users Management</h1>
        {loading ? <p>Loading...</p> :
          error ? <p className="text-red-600">{error}</p> :
          <>
            <div className="bg-white shadow rounded p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className="border-t">
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <select
                          value={u.role}
                          onChange={(e) => handleRole(u._id, e.target.value)}
                          className="border rounded px-2 py-1"
                        >
                          <option value="student">student</option>
                          <option value="teacher">teacher</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button onClick={() => handleDelete(u._id)} className="btn btn-sm">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        }
      </div>
    </div>
  );
}