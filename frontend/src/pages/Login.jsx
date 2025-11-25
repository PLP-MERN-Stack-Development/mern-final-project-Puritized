import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'admin') nav('/admin');
      else if (user.role === 'teacher') nav('/teacher');
      else nav('/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7fafc] pt-16">
      <form onSubmit={submit} className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl font-semibold mb-4">Login</h1>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <label className="block mb-2 text-sm">Email</label>
        <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="input mb-3" />
        <label className="block mb-2 text-sm">Password</label>
        <input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="input mb-4" />
        <button disabled={busy} className="btn w-full">{busy ? 'Signing in...' : 'Sign in'}</button>
      </form>
    </div>
  );
}