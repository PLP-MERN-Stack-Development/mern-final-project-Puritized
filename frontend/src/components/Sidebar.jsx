import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X } from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  const links = [
    { name: 'Dashboard', to: '/' },
    { name: 'Courses', to: '/courses' },
    { name: 'Lessons', to: '/lessons' }
  ];

  const authLinks = [
    { name: 'Bookings', to: '/bookings' },
    { name: 'Payments', to: '/payments' },
    { name: 'Chat', to: '/chat' }
  ];

  return (
    <>
      <button className="md:hidden fixed top-4 left-4 z-40 bg-blue-600 text-white p-2 rounded-md" onClick={() => setOpen(true)}>
        <Menu className="w-5 h-5" />
      </button>

      {open && <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setOpen(false)} />}

      <aside className={`fixed top-0 left-0 h-full w-64 p-6 bg-white border-r border-gray-200 z-40 transform transition-transform md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <button className="md:hidden absolute right-4 top-4 p-2" onClick={() => setOpen(false)}><X /></button>
        <h3 className="text-lg font-semibold mb-6">Admin Panel</h3>

        <nav className="flex flex-col gap-2">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} className={({isActive}) => `px-3 py-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700'}`}>{l.name}</NavLink>
          ))}

          {user && <>
            <div className="mt-4 border-t border-gray-100" />
            {authLinks.map(l => (
              <NavLink key={l.to} to={l.to} className={({isActive}) => `px-3 py-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700'}`}>{l.name}</NavLink>
            ))}
          </>}
        </nav>
      </aside>
    </>
  );
}