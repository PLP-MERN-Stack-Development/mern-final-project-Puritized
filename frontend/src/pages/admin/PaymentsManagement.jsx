import React, { useEffect, useState } from "react";
import { fetchPaymentsAdmin, markRefunded } from "../../api/adminApi";

export default function PaymentsManagement() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchPaymentsAdmin();
      setPayments(res.data.payments || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleRefund = async (id) => {
    if (!confirm("Mark payment refunded?")) return;
    try {
      await markRefunded(id);
      setPayments(prev => prev.map(p => p._id === id ? { ...p, refunded: true } : p));
    } catch (err) {
      console.error(err);
      alert("Refund failed");
    }
  };

  return (
    <div className="pt-24 p-6 md:ml-64">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Payments Management</h1>

        {loading ? <p>Loading...</p> : (
          <div className="bg-white shadow rounded p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th>Email</th><th>Amount</th><th>Course</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p._id} className="border-t">
                    <td>{p.email}</td>
                    <td>${p.amount}</td>
                    <td>{p.courseTitle}</td>
                    <td>{p.refunded ? "Refunded" : p.status || "Paid"}</td>
                    <td>
                      {!p.refunded && <button onClick={() => handleRefund(p._id)} className="btn btn-sm">Mark refunded</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}