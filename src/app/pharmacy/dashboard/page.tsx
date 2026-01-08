'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { api, getToken } from '@/lib/api';

const pharmacyNav = [
  { label: 'Dashboard', href: '/pharmacy/dashboard' },
  { label: 'Orders', href: '/pharmacy/orders' },
];

export default function PharmacyDashboard() {
  const [pharmacy, setPharmacy] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      if (!token) {
        window.location.href = '/login';
        return;
      }

      try {
        const [pharmacyData, ordersData] = await Promise.all([
          api('/pharmacies/me', { token }),
          api('/orders/for-pharmacy', { token }),
        ]);

        setPharmacy(pharmacyData);
        setOrders(ordersData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout items={pharmacyNav} title="Pharmacy Portal">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  const pendingOrders = orders.filter((o) => o.status !== 'delivered');

  return (
    <DashboardLayout items={pharmacyNav} title="Pharmacy Portal">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Welcome, {pharmacy?.businessName || 'Pharmacy'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-gray-500 text-sm">Total Orders</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">{orders.length}</p>
        </div>
        <div className="card">
          <h3 className="text-gray-500 text-sm">Pending Orders</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">{pendingOrders.length}</p>
        </div>
        <div className="card">
          <h3 className="text-gray-500 text-sm">Verification Status</h3>
          <p className={`text-lg font-bold mt-2 ${pharmacy?.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
            {pharmacy?.isVerified ? 'Verified' : 'Pending Verification'}
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Pharmacy Profile</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Display ID:</span>
            <p className="font-medium">{pharmacy?.displayId}</p>
          </div>
          <div>
            <span className="text-gray-500">Address:</span>
            <p className="font-medium">{pharmacy?.address}</p>
          </div>
          <div>
            <span className="text-gray-500">Phone:</span>
            <p className="font-medium">{pharmacy?.phone}</p>
          </div>
        </div>
      </div>

      {!pharmacy?.isVerified && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Your pharmacy is pending verification. An admin will review and verify it soon.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}
