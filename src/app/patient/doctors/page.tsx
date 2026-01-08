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

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [appointmentType, setAppointmentType] = useState<'video' | 'audio' | 'in_person'>('video');
  const [scheduledAt, setScheduledAt] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await api('/doctors');
        setDoctors(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) return;

    setSubmitting(true);
    try {
      const token = getToken();
      await api('/appointments', {
        method: 'POST',
        token,
        body: {
          doctorId: selectedDoctor,
          type: appointmentType,
          scheduledAt: new Date(scheduledAt).toISOString(),
          notes,
        },
      });

      setSelectedDoctor(null);
      setScheduledAt('');
      setNotes('');
      alert('Appointment created successfully!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout items={patientNav} title="Patient Portal">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Find Doctors</h1>

      {selectedDoctor && (
        <div className="card mb-6">
          <h2 className="text-lg font-semibold mb-4">Book Appointment</h2>
          <form onSubmit={handleCreateAppointment}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label">Type</label>
                <select
                  className="input"
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value as any)}
                >
                  <option value="video">Video Call</option>
                  <option value="audio">Audio Call</option>
                  <option value="in_person">In Person</option>
                </select>
              </div>
              <div>
                <label className="label">Date & Time</label>
                <input
                  type="datetime-local"
                  className="input"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label">Notes</label>
                <input
                  type="text"
                  className="input"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Reason for visit"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Booking...' : 'Book Appointment'}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setSelectedDoctor(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : doctors.length === 0 ? (
          <p className="text-gray-500">No doctors available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doctor) => (
              <div key={doctor._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{doctor.fullName}</h3>
                    <p className="text-sm text-gray-500">{doctor.specialization}</p>
                    <p className="text-sm text-gray-500 capitalize">
                      {doctor.doctorType.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{doctor.displayId}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      doctor.isVerified
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {doctor.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <button
                  className="btn-primary w-full mt-4 text-sm"
                  onClick={() => setSelectedDoctor(doctor._id)}
                  disabled={!doctor.isVerified}
                >
                  {doctor.isVerified ? 'Book Appointment' : 'Not Verified'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
