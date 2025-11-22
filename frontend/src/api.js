const API_URL = import.meta.env.VITE_BACKEND_URL;

export async function fetchAPI(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      credentials: 'include', // for cookies/auth
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('API fetch error:', err);
    return null;
  }
}