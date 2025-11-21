import React from 'react';
import Sidebar from '../components/Sidebar';
import { useBookings } from '../api/bookings';

export default function Bookings() {
  const { data: bookings, isLoading } = useBookings();

  return (
    <div className="flex pt-16">
      <Sidebar />

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Bookings</h1>

        {isLoading ? (
          <p>Loading bookings...</p>
        ) : (
          <ul className="space-y-2">
            {bookings?.map((booking) => (
              <li key={booking._id} className="p-4 border rounded hover:shadow-md">
                {booking.user?.name} booked {booking.course?.title}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}