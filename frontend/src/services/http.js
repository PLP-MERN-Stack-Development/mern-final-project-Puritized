// simple fetch wrapper with optional token and refresh flow
const API_BASE = process.env.VITE_BACKEND_URL || 'https://mern-final-project-puritized.onrender.com';

/* --------------------------------------
   Parse JSON safely
----------------------------------------*/
async function parseJSON(resp) {
  const text = await resp.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/* --------------------------------------
   HTTP request wrapper
----------------------------------------*/
export default {
  async request(path, { method = 'GET', body, token, headers = {}, raw = false } = {}) {
    const opts = { method, headers: { ...headers } };

    if (token) opts.headers['Authorization'] = `Bearer ${token}`;

    if (body) {
      if (raw) {
        opts.body = body; // for FormData / files
      } else {
        opts.headers['Content-Type'] = 'application/json';
        opts.body = JSON.stringify(body);
      }
    }

    const resp = await fetch(`${API_BASE}${path}`, opts);
    const data = await parseJSON(resp);

    if (resp.status === 401) {
      // optionally, trigger refresh token flow here
      throw { code: 401, data };
    }

    if (!resp.ok) throw { code: resp.status, data };

    return data;
  }
};