import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-extrabold text-red-500 mb-4 animate-pulse">404</h1>
        <p className="text-xl md:text-2xl mb-6 text-gray-700">
          Oops! The page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}