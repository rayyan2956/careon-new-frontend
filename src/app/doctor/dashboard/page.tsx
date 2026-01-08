'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { api, getToken } from '@/lib/api';

const doctorNav = [
  { label: 'Dashboard', href: '/doctor/dashboard' },
  { label: 'Appointments', href: '/doctor/appointments' },
  { label: 'Prescriptions', href: '/doctor/prescriptions' },
];

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      if (!token) {
        window.location.href = '/login';
        return;
      }

      try {
        const [doctorData, appointmentsData] = await Promise.all([
          api('/doctors/me', { token }),
          api('/appointments/for-me', { token }),
        ]);

        setDoctor(doctorData);
        setAppointments(appointmentsData);
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
      <DashboardLayout items={doctorNav} title="Doctor Portal">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === 'pending' || apt.status === 'confirmed'
  );

  return (
    <DashboardLayout items={doctorNav} title="Doctor Portal">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Welcome, Dr. {doctor?.fullName || 'Doctor'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-gray-500 text-sm">Total Appointments</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">{appointments.length}</p>
        </div>
        <div className="card">
          <h3 className="text-gray-500 text-sm">Upcoming</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">{upcomingAppointments.length}</p>
        </div>
        <div className="card">
          <h3 className="text-gray-500 text-sm">Verification Status</h3>
          <p className={`text-lg font-bold mt-2 ${doctor?.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
            {doctor?.isVerified ? 'Verified' : 'Pending Verification'}
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Your Profile</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Display ID:</span>
            <p className="font-medium">{doctor?.displayId}</p>
          </div>
          <div>
            <span className="text-gray-500">Specialization:</span>
            <p className="font-medium">{doctor?.specialization}</p>
          </div>
          <div>
            <span className="text-gray-500">Doctor Type:</span>
            <p className="font-medium capitalize">{doctor?.doctorType?.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      {!doctor?.isVerified && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Your account is pending verification. An admin will review your profile and verify it soon.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}
