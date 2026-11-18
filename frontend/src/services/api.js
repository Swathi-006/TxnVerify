
import { useEffect, useState } from 'react';

const BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

export async function api(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('token');

  // Avoid duplicate /api in request URLs
  const endpoint = path.startsWith('/api/')
    ? path.substring(4)
    : path.startsWith('/')
      ? path
      : `/${path}`;

  const url = `${BASE}${endpoint}`;

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {})
  });

  const data = await res.json().catch(() => ({}));

  if (res.status === 401 && token && !path.startsWith('/auth')) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
}

export function usePoll(path, ms = 1500) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!path) {
      setData(null);
      setError('');
      return;
    }

    let live = true;

    const tick = async () => {
      try {
        const result = await api(path);
        if (live) {
          setData(result);
          setError('');
        }
      } catch (err) {
        if (live) setError(err.message);
      }
    };

    tick();
    const id = setInterval(tick, ms);

    return () => {
      live = false;
      clearInterval(id);
    };
  }, [path, ms]);

  return { data, error };
}

export const money = (n) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(n);

export const when = (d) =>
  new Date(d).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
