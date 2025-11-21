// simple fetch wrapper with refresh token flow
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

async function parseJSON(resp) {
  const text = await resp.text();
  try { return JSON.parse(text); } catch { return text; }
}

export default {
  async request(path, { method = 'GET', body, token, headers = {}, raw = false } = {}) {
    const opts = { method, headers: { ...headers } };
    if (token) opts.headers['Authorization'] = `Bearer ${token}`;
    if (body && !raw) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    } else if (body && raw) {
      opts.body = body; // for file / formdata
    }
    const resp = await fetch(`${API_BASE}${path}`, opts);
    const data = await parseJSON(resp);
    if (resp.status === 401) {
      throw { code: 401, data };
    }
    if (!resp.ok) throw { code: resp.status, data };
    return data;
  }
};