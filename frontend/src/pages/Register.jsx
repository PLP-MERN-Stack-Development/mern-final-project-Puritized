import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerRequest } from '../api/authApi';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await registerRequest(form);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      console.error('Register error:', err);
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7fafc] pt-16">
      <form onSubmit={submit} className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl font-semibold mb-4">Register</h1>
        {error && <div className="text-red-600 mb-2">{error}</div>}

        <label className="block mb-2 text-sm">Full Name</label>
        <input
          type="text"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="input mb-3"
          required
        />

        <label className="block mb-2 text-sm">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="input mb-3"
          required
        />

        <label className="block mb-2 text-sm">Password</label>
        <input
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          className="input mb-3"
          required
        />

        <label className="block mb-2 text-sm">Role</label>
        <select
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
          className="input mb-4"
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        <button disabled={busy} className="btn w-full">
          {busy ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}