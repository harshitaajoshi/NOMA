import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let cached = '';

/** A random id per browser: the backend keeps this visitor's resumes and tracker apart from everyone else's. */
export function clientId(): string {
  if (typeof window === 'undefined') return '';
  if (cached) return cached;
  try {
    cached = localStorage.getItem('noma.client') ?? '';
  } catch {}
  if (!cached) {
    cached = crypto.randomUUID();
    try {
      localStorage.setItem('noma.client', cached);
    } catch {}
  }
  return cached;
}

api.interceptors.request.use((config) => {
  const id = clientId();
  if (id) config.headers['x-noma-client'] = id;
  return config;
});

export default api;
