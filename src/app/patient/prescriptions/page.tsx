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

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState<string | null>(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const [prescData, pharmData] = await Promise.all([
          api('/prescriptions/mine', { token }),
          api('/pharmacies'),
        ]);
        setPrescriptions(prescData);
        setPharmacies(pharmData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPrescription || !selectedPharmacy) return;

    setSubmitting(true);
    try {
      const token = getToken();
      await api('/orders', {
        method: 'POST',
        token,
        body: {
          prescriptionId: selectedPrescription,
          pharmacyId: selectedPharmacy,
        },
      });

      setSelectedPrescription(null);
      setSelectedPharmacy('');
      alert('Order placed successfully!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout items={patientNav} title="Patient Portal">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Prescriptions</h1>

      {selectedPrescription && (
        <div className="card mb-6">
          <h2 className="text-lg font-semibold mb-4">Order Medications</h2>
          <form onSubmit={handleOrder}>
            <div className="mb-4">
              <label className="label">Select Pharmacy</label>
              <select
                className="input"
                value={selectedPharmacy}
                onChange={(e) => setSelectedPharmacy(e.target.value)}
                required
              >
                <option value="">Choose a pharmacy...</option>
                {pharmacies.filter(p => p.isVerified).map((pharm) => (
                  <option key={pharm._id} value={pharm._id}>
                    {pharm.businessName} - {pharm.address}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Ordering...' : 'Place Order'}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setSelectedPrescription(null)}
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
        ) : prescriptions.length === 0 ? (
          <p className="text-gray-500">No prescriptions yet.</p>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((presc) => (
              <div key={presc._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold">Diagnosis: {presc.diagnosis}</p>
                    <p className="text-sm text-gray-500">
                      Dr. {presc.doctorId?.fullName || 'Unknown'} •{' '}
                      {new Date(presc.issuedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    className="btn-primary text-sm"
                    onClick={() => setSelectedPrescription(presc._id)}
                  >
                    Order
                  </button>
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
