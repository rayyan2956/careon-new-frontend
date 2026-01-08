'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { api, getToken } from '@/lib/api';

const pharmacyNav = [
  { label: 'Dashboard', href: '/pharmacy/dashboard' },
  { label: 'Orders', href: '/pharmacy/orders' },
];

const statusColors: Record<string, string> = {
  received: 'bg-yellow-100 text-yellow-700',
  preparing: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
};

export default function PharmacyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const data = await api('/orders/for-pharmacy', { token });
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const token = getToken();
    try {
      await api(`/orders/${id}`, {
        method: 'PUT',
        token,
        body: { status },
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout items={pharmacyNav} title="Pharmacy Portal">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders</h1>

      <div className="card">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2">Patient</th>
                <th className="text-left py-3 px-2">Date</th>
                <th className="text-left py-3 px-2">Status</th>
                <th className="text-left py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="py-3 px-2">{order.patientId?.fullName || 'Unknown'}</td>
                  <td className="py-3 px-2">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <select
                      className="input text-sm py-1"
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                    >
                      <option value="received">Received</option>
                      <option value="preparing">Preparing</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
