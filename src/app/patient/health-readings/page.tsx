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

const readingTypes = [
  { value: 'blood_pressure', label: 'Blood Pressure' },
  { value: 'blood_glucose', label: 'Blood Glucose' },
  { value: 'temperature', label: 'Temperature' },
  { value: 'spo2', label: 'SpO2' },
  { value: 'heart_rate', label: 'Heart Rate' },
];

export default function HealthReadingsPage() {
  const [readings, setReadings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [readingType, setReadingType] = useState('blood_pressure');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReadings = async () => {
    const token = getToken();
    if (!token) return;
    
    try {
      const data = await api('/health-readings/mine', { token });
      setReadings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = getToken();
      await api('/health-readings', {
        method: 'POST',
        token,
        body: { readingType, value, notes },
      });

      setValue('');
      setNotes('');
      setShowForm(false);
      fetchReadings();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this reading?')) return;

    try {
      const token = getToken();
      await api(`/health-readings/${id}`, { method: 'DELETE', token });
      fetchReadings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout items={patientNav} title="Patient Portal">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Health Readings</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Reading'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label">Reading Type</label>
                <select
                  className="input"
                  value={readingType}
                  onChange={(e) => setReadingType(e.target.value)}
                >
                  {readingTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Value</label>
                <input
                  type="text"
                  className="input"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="e.g., 120/80"
                  required
                />
              </div>
              <div>
                <label className="label">Notes (optional)</label>
                <input
                  type="text"
                  className="input"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="btn-primary mt-4" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Reading'}
            </button>
          </form>
        </div>
      )}

      <div className="card">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : readings.length === 0 ? (
          <p className="text-gray-500">No health readings yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2">Type</th>
                <th className="text-left py-3 px-2">Value</th>
                <th className="text-left py-3 px-2">Notes</th>
                <th className="text-left py-3 px-2">Date</th>
                <th className="text-left py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {readings.map((reading) => (
                <tr key={reading._id} className="border-b">
                  <td className="py-3 px-2 capitalize">
                    {reading.readingType.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-2">{JSON.stringify(reading.value)}</td>
                  <td className="py-3 px-2">{reading.notes || '-'}</td>
                  <td className="py-3 px-2">
                    {new Date(reading.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-2">
                    <button
                      onClick={() => handleDelete(reading._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
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
