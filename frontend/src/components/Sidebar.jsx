import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "@/lib/utils"; // ShadCN utility

export default function Sidebar() {
  const { user } = useAuth();

  const links = [
    { name: "Dashboard", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Lessons", path: "/lessons" },
  ];

  const authLinks = [
    { name: "Bookings", path: "/bookings" },
    { name: "Payments", path: "/payments" },
    { name: "Chat", path: "/chat" },
  ];

  return (
    <aside className="w-64 fixed top-0 left-0 h-screen bg-card border-r border-border p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-8 text-foreground">Admin Panel</h2>

      <nav className="flex flex-col space-y-2">
        {links.map((item) => (
          <NavItem key={item.path} name={item.name} path={item.path} />
        ))}

        {user && (
          <>
            <div className="mt-6 mb-2 border-t border-border/50"></div>

            {authLinks.map((item) => (
              <NavItem key={item.path} name={item.name} path={item.path} />
            ))}
          </>
        )}
      </nav>
    </aside>
  );
}

/** ShadCN-style nav item */
function NavItem({ name, path }) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        cn(
          "block px-4 py-2 rounded-md text-sm font-medium transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          isActive
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground"
        )
      }
    >
      {name}
    </NavLink>
  );
}