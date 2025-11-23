 import React from "react";
import { Link } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout, loading } = useAuth();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Brand */}
          <Link
            to="/"
            className="text-lg font-bold text-primary hover:text-primary-foreground truncate"
          >
            EduBridge - E-Learning Marketplace (SDG4)
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link
              to="/courses"
              className="text-foreground hover:text-primary transition-colors"
            >
              Courses
            </Link>
            <Link
              to="/lessons"
              className="text-foreground hover:text-primary transition-colors"
            >
              Lessons
            </Link>
            <Link
              to="/chat"
              className="text-foreground hover:text-primary transition-colors"
            >
              Chat
            </Link>

            <NotificationBell />

            {/* Auth Buttons */}
            {loading ? (
              <span className="text-muted-foreground">Checking...</span>
            ) : user ? (
              <button
                onClick={logout}
                className="px-3 py-1 rounded bg-destructive text-destructive-foreground hover:bg-destructive/90 transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}