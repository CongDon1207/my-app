// client/src/api/tasks.js
const BASE = '/api/tasks';

// Toggle (không truyền done) hoặc set done rõ ràng
export async function toggleTask(id, done) {
  const opts = { method: 'PATCH' };

  if (done !== undefined) {
    opts.headers = { 'Content-Type': 'application/json' };
    opts.body = JSON.stringify({ done: !!done });
  }
  // done === undefined -> không gửi body -> server sẽ toggle

  const res = await fetch(`${BASE}/${id}`, opts);
  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err?.error || `PATCH failed (${res.status})`);
  }
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (res.status === 204) return true; // No Content
  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err?.error || `DELETE failed (${res.status})`);
  }
  return true;
}

async function safeJson(res) {
  try { return await res.json(); } catch { return null; }
}
