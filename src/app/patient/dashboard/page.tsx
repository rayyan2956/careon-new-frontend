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

export default function PatientDashboard() {
  const [patient, setPatient] = useState<any>(null);
  const [stats, setStats] = useState({ readings: 0, appointments: 0, prescriptions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      if (!token) {
        window.location.href = '/login';
        return;
      }

      try {
        const [patientData, readings, appointments, prescriptions] = await Promise.all([
          api('/patients/me', { token }),
          api('/health-readings/mine', { token }),
          api('/appointments/mine', { token }),
          api('/prescriptions/mine', { token }),
        ]);

        setPatient(patientData);
        setStats({
          readings: readings.length,
          appointments: appointments.length,
          prescriptions: prescriptions.length,
        });
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
      <DashboardLayout items={patientNav} title="Patient Portal">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout items={patientNav} title="Patient Portal">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Welcome, {patient?.fullName || 'Patient'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-gray-500 text-sm">Health Readings</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">{stats.readings}</p>
        </div>
        <div className="card">
          <h3 className="text-gray-500 text-sm">Appointments</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">{stats.appointments}</p>
        </div>
        <div className="card">
          <h3 className="text-gray-500 text-sm">Prescriptions</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">{stats.prescriptions}</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Your Profile</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Full Name:</span>
            <p className="font-medium">{patient?.fullName}</p>
          </div>
          <div>
            <span className="text-gray-500">Phone:</span>
            <p className="font-medium">{patient?.phone || 'Not set'}</p>
          </div>
          <div>
            <span className="text-gray-500">Patient Type:</span>
            <p className="font-medium capitalize">{patient?.patientType?.replace('_', ' ')}</p>
          </div>
          <div>
            <span className="text-gray-500">Diseases:</span>
            <p className="font-medium">{patient?.diseases?.join(', ') || 'None'}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
