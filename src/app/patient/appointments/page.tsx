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
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-green-100 text-green-700',
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const data = await api('/appointments/mine', { token });
        setAppointments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <DashboardLayout items={patientNav} title="Patient Portal">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Appointments</h1>

      <div className="card">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : appointments.length === 0 ? (
          <p className="text-gray-500">No appointments yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2">Doctor</th>
                <th className="text-left py-3 px-2">Type</th>
                <th className="text-left py-3 px-2">Date & Time</th>
                <th className="text-left py-3 px-2">Status</th>
                <th className="text-left py-3 px-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt._id} className="border-b">
                  <td className="py-3 px-2">{apt.doctorId?.fullName || 'Unknown'}</td>
                  <td className="py-3 px-2 capitalize">{apt.type.replace('_', ' ')}</td>
                  <td className="py-3 px-2">
                    {new Date(apt.scheduledAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${statusColors[apt.status]}`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-3 px-2">{apt.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
