const API_BASE = 'http://localhost:3001';

interface ApiOptions {
  method?: string;
  body?: any;
  token?: string | null;
}

export async function api(endpoint: string, options: ApiOptions = {}) {
  const { method = 'GET', body, token } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

export function getUser(): { id: string; email: string; role: string } | null {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}
