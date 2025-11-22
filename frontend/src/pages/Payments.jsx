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
        <h1 className="text-2xl font-bold mb-6">Payments</h1>

        {/* Payment Form */}
        <section className="mb-8">
          <PaymentForm />
        </section>

        {/* Recent Payments */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Recent Payments</h2>
          {isLoading ? (
            <p>Loading payments...</p>
          ) : payments?.length ? (
            <ul className="space-y-2">
              {payments.map((p) => (
                <li key={p._id} className="p-3 border rounded shadow-sm hover:shadow-md transition-shadow">
                  <span className="font-medium">{p.user?.name}</span> paid{' '}
                  <span className="font-semibold">${p.amount}</span> on{' '}
                  {new Date(p.createdAt).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>No payments found.</p>
          )}
        </section>
      </main>
    </div>
  );
}