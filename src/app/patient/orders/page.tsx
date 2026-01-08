'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { api, getToken } from '@/lib/api';

const patientNav = [
  { label: 'Dashboard', href: '/patient/dashboard' },
  { label: 'Health Readings', href: '/patient/health-readings' },
  { label: 'Doctors', href: '/patient/doctors' },
  { label: 'Appointments', href: '/patient/appointments' },
  { label: 'Prescriptions', href: '/patient/prescriptions' },
  { label: 'Orders', href: '/patient/orders' },
];

const statusColors: Record<string, string> = {
  received: 'bg-yellow-100 text-yellow-700',
  preparing: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const data = await api('/orders/mine', { token });
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <DashboardLayout items={patientNav} title="Patient Portal">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>

      <div className="card">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2">Pharmacy</th>
                <th className="text-left py-3 px-2">Status</th>
                <th className="text-left py-3 px-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="py-3 px-2">{order.pharmacyId?.businessName || 'Unknown'}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    {new Date(order.createdAt).toLocaleDateString()}
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
