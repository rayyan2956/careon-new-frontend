'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

type RegisterType = 'patient' | 'doctor' | 'pharmacy';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [registerType, setRegisterType] = useState<RegisterType>('patient');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Patient register
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  // Doctor register
  const [specialization, setSpecialization] = useState('');
  const [doctorType, setDoctorType] = useState<'hospital_affiliated' | 'home_visit'>('hospital_affiliated');

  // Pharmacy register
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api('/auth/login', {
        method: 'POST',
        body: { email, password },
      });

      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push(`/${data.user.role}/dashboard`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let endpoint = '';
      let body: any = { email, password };

      switch (registerType) {
        case 'patient':
          endpoint = '/auth/register-patient';
          body = { ...body, fullName, phone, dateOfBirth: dateOfBirth || undefined };
          break;
        case 'doctor':
          endpoint = '/auth/register-doctor';
          body = { ...body, fullName, specialization, doctorType };
          break;
        case 'pharmacy':
          endpoint = '/auth/register-pharmacy';
          body = { ...body, businessName, address, phone };
          break;
      }

      const data = await api(endpoint, { method: 'POST', body });

      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push(`/${data.user.role}/dashboard`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div className="card w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary-600">CareOn</h1>
          <p className="text-gray-500 mt-1">Health Monitoring System</p>
        </div>

        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 text-center rounded-l-lg transition-colors ${
              isLogin ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 text-center rounded-r-lg transition-colors ${
              !isLogin ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {isLogin ? (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="label">Register as</label>
              <select
                className="input"
                value={registerType}
                onChange={(e) => setRegisterType(e.target.value as RegisterType)}
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="pharmacy">Pharmacy</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {registerType === 'patient' && (
              <>
                <div className="mb-4">
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    className="input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="label">Phone</label>
                  <input
                    type="tel"
                    className="input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="label">Date of Birth</label>
                  <input
                    type="date"
                    className="input"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                </div>
              </>
            )}

            {registerType === 'doctor' && (
              <>
                <div className="mb-4">
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    className="input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="label">Specialization</label>
                  <input
                    type="text"
                    className="input"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="label">Doctor Type</label>
                  <select
                    className="input"
                    value={doctorType}
                    onChange={(e) => setDoctorType(e.target.value as any)}
                  >
                    <option value="hospital_affiliated">Hospital Affiliated</option>
                    <option value="home_visit">Home Visit</option>
                  </select>
                </div>
              </>
            )}

            {registerType === 'pharmacy' && (
              <>
                <div className="mb-4">
                  <label className="label">Business Name</label>
                  <input
                    type="text"
                    className="input"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="label">Address</label>
                  <input
                    type="text"
                    className="input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="label">Phone</label>
                  <input
                    type="tel"
                    className="input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
