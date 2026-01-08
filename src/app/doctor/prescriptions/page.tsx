'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { api, getToken } from '@/lib/api';

const doctorNav = [
  { label: 'Dashboard', href: '/doctor/dashboard' },
  { label: 'Appointments', href: '/doctor/appointments' },
  { label: 'Prescriptions', href: '/doctor/prescriptions' },
];

export default function DoctorPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [medications, setMedications] = useState([
    { name: '', dosage: '', frequency: '', duration: '' },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const [prescData, aptData] = await Promise.all([
        api('/prescriptions/by-doctor', { token }),
        api('/appointments/for-me', { token }),
      ]);
      setPrescriptions(prescData);
      setAppointments(aptData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '' }]);
  };

  const updateMedication = (index: number, field: string, value: string) => {
    const updated = [...medications];
    (updated[index] as any)[field] = value;
    setMedications(updated);
  };

  const removeMedication = (index: number) => {
    if (medications.length > 1) {
      setMedications(medications.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) return;

    setSubmitting(true);
    try {
      const token = getToken();
      await api('/prescriptions', {
        method: 'POST',
        token,
        body: {
          patientId: selectedPatientId,
          diagnosis,
          medications: medications.filter((m) => m.name),
        },
      });

      setShowForm(false);
      setSelectedPatientId('');
      setDiagnosis('');
      setMedications([{ name: '', dosage: '', frequency: '', duration: '' }]);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Get unique patients from appointments
  const patients = appointments.reduce((acc: any[], apt) => {
    if (apt.patientId && !acc.find((p) => p._id === apt.patientId._id)) {
      acc.push(apt.patientId);
    }
    return acc;
  }, []);

  return (
    <DashboardLayout items={doctorNav} title="Doctor Portal">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Prescriptions</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'New Prescription'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="text-lg font-semibold mb-4">Create Prescription</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label">Patient</label>
                <select
                  className="input"
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  required
                >
                  <option value="">Select patient...</option>
                  {patients.map((patient: any) => (
                    <option key={patient._id} value={patient._id}>
                      {patient.fullName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Diagnosis</label>
                <input
                  type="text"
                  className="input"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="label mb-0">Medications</label>
                <button type="button" className="text-primary-600 text-sm" onClick={addMedication}>
                  + Add Medication
                </button>
              </div>
              {medications.map((med, idx) => (
                <div key={idx} className="grid grid-cols-5 gap-2 mb-2">
                  <input
                    type="text"
                    className="input"
                    placeholder="Name"
                    value={med.name}
                    onChange={(e) => updateMedication(idx, 'name', e.target.value)}
                  />
                  <input
                    type="text"
                    className="input"
                    placeholder="Dosage"
                    value={med.dosage}
                    onChange={(e) => updateMedication(idx, 'dosage', e.target.value)}
                  />
                  <input
                    type="text"
                    className="input"
                    placeholder="Frequency"
                    value={med.frequency}
                    onChange={(e) => updateMedication(idx, 'frequency', e.target.value)}
                  />
                  <input
                    type="text"
                    className="input"
                    placeholder="Duration"
                    value={med.duration}
                    onChange={(e) => updateMedication(idx, 'duration', e.target.value)}
                  />
                  <button
                    type="button"
                    className="text-red-600 hover:text-red-800"
                    onClick={() => removeMedication(idx)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Prescription'}
            </button>
          </form>
        </div>
      )}

      <div className="card">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : prescriptions.length === 0 ? (
          <p className="text-gray-500">No prescriptions yet.</p>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((presc) => (
              <div key={presc._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold">Patient: {presc.patientId?.fullName || 'Unknown'}</p>
                    <p className="text-sm text-gray-500">
                      Diagnosis: {presc.diagnosis} • {new Date(presc.issuedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium mb-2">Medications:</p>
                  <ul className="text-sm space-y-1">
                    {presc.medications.map((med: any, idx: number) => (
                      <li key={idx}>
                        <strong>{med.name}</strong> - {med.dosage}, {med.frequency}, {med.duration}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
