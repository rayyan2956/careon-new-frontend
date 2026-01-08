'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { getToken, getUser } from '@/lib/api';

const adminNav = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Doctors', href: '/admin/doctors' },
  { label: 'Pharmacies', href: '/admin/pharmacies' },
];

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    const user = getUser();
    if (!token || user?.role !== 'admin') {
      router.push('/login');
    }
  }, [router]);

  return (
    <DashboardLayout items={adminNav} title="Admin Portal">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className="card cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push('/admin/doctors')}
        >
          <h2 className="text-xl font-semibold text-primary-600 mb-2">Manage Doctors</h2>
          <p className="text-gray-500">
            View and verify doctor accounts. Toggle verification status.
          </p>
        </div>

        <div
          className="card cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push('/admin/pharmacies')}
        >
          <h2 className="text-xl font-semibold text-primary-600 mb-2">Manage Pharmacies</h2>
          <p className="text-gray-500">
            View and verify pharmacy accounts. Toggle verification status.
          </p>
        </div>
      </div>

      <div className="mt-8 card bg-blue-50 border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">Admin Information</h3>
        <p className="text-blue-700 text-sm">
          As an admin, you can verify doctors and pharmacies by toggling their verification status.
          This is a simulated KYC process - no real verification is performed.
        </p>
      </div>
    </DashboardLayout>
  );
}
