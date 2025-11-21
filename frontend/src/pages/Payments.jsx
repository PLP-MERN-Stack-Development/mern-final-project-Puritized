import React from 'react';
import Sidebar from '../components/Sidebar';
import PaymentForm from '../components/PaymentForm';
import { usePayments } from '../api/payments';

export default function Payments() {
  const { data: payments, isLoading } = usePayments();

  return (
    <div className="flex pt-16">
      <Sidebar />

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Payments</h1>

        <section className="mb-6">
          <PaymentForm />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Recent Payments</h2>
          {isLoading ? (
            <p>Loading payments...</p>
          ) : (
            <ul className="space-y-2">
              {payments?.map((p) => (
                <li key={p._id} className="p-2 border rounded">
                  {p.user?.name} paid ${p.amount} on {new Date(p.createdAt).toLocaleDateString()}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}