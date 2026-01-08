'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { api, getToken } from '@/lib/api';

const adminNav = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Doctors', href: '/admin/doctors' },
  { label: 'Pharmacies', href: '/admin/pharmacies' },
];

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const data = await api('/admin/doctors', { token });
      setDoctors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const toggleVerification = async (id: string) => {
    const token = getToken();
    try {
      await api(`/admin/doctors/${id}/verify`, {
        method: 'PUT',
        token,
      });
      fetchDoctors();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout items={adminNav} title="Admin Portal">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Doctors</h1>

      <div className="card">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : doctors.length === 0 ? (
          <p className="text-gray-500">No doctors registered yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2">Display ID</th>
                <th className="text-left py-3 px-2">Name</th>
                <th className="text-left py-3 px-2">Specialization</th>
                <th className="text-left py-3 px-2">Type</th>
                <th className="text-left py-3 px-2">Status</th>
                <th className="text-left py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor._id} className="border-b">
                  <td className="py-3 px-2 font-mono text-sm">{doctor.displayId}</td>
                  <td className="py-3 px-2">{doctor.fullName}</td>
                  <td className="py-3 px-2">{doctor.specialization}</td>
                  <td className="py-3 px-2 capitalize">{doctor.doctorType.replace('_', ' ')}</td>
                  <td className="py-3 px-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        doctor.isVerified
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {doctor.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <button
                      className={`px-3 py-1 text-sm rounded ${
                        doctor.isVerified
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                      onClick={() => toggleVerification(doctor._id)}
                    >
                      {doctor.isVerified ? 'Revoke' : 'Verify'}
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
