'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { api, getToken } from '@/lib/api';

const adminNav = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Doctors', href: '/admin/doctors' },
  { label: 'Pharmacies', href: '/admin/pharmacies' },
];

export default function AdminPharmaciesPage() {
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPharmacies = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const data = await api('/admin/pharmacies', { token });
      setPharmacies(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const toggleVerification = async (id: string) => {
    const token = getToken();
    try {
      await api(`/admin/pharmacies/${id}/verify`, {
        method: 'PUT',
        token,
      });
      fetchPharmacies();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout items={adminNav} title="Admin Portal">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Pharmacies</h1>

      <div className="card">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : pharmacies.length === 0 ? (
          <p className="text-gray-500">No pharmacies registered yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2">Display ID</th>
                <th className="text-left py-3 px-2">Business Name</th>
                <th className="text-left py-3 px-2">Address</th>
                <th className="text-left py-3 px-2">Phone</th>
                <th className="text-left py-3 px-2">Status</th>
                <th className="text-left py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pharmacies.map((pharmacy) => (
                <tr key={pharmacy._id} className="border-b">
                  <td className="py-3 px-2 font-mono text-sm">{pharmacy.displayId}</td>
                  <td className="py-3 px-2">{pharmacy.businessName}</td>
                  <td className="py-3 px-2">{pharmacy.address}</td>
                  <td className="py-3 px-2">{pharmacy.phone}</td>
                  <td className="py-3 px-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        pharmacy.isVerified
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {pharmacy.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <button
                      className={`px-3 py-1 text-sm rounded ${
                        pharmacy.isVerified
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                      onClick={() => toggleVerification(pharmacy._id)}
                    >
                      {pharmacy.isVerified ? 'Revoke' : 'Verify'}
                    </button>
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
