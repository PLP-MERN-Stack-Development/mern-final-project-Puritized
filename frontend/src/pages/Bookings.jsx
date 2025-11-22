import React from 'react';
import Sidebar from '../components/Sidebar';
import { useBookings } from '../api/bookings';

export default function Bookings() {
  const { data: bookings, isLoading, isError } = useBookings();

  return (
    <div className="flex pt-16"> {/* Offset for Navbar */}
      <Sidebar />

      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Bookings</h1>

        {isLoading && <p>Loading bookings...</p>}
        {isError && <p className="text-red-500">Failed to load bookings.</p>}

        {!isLoading && bookings?.length === 0 && (
          <p>No bookings found.</p>
        )}

        <ul className="space-y-3">
          {bookings?.map((booking) => (
            <li
              key={booking._id}
              className="p-4 border rounded shadow hover:shadow-lg transition"
            >
              <p>
                <strong>{booking.user?.name}</strong> booked{' '}
                <span className="text-blue-600">{booking.course?.title}</span>
              </p>
              <p className="text-gray-500 text-sm">
                Date: {new Date(booking.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}