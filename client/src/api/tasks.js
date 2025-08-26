// client/src/api/tasks.js
import { httpJSON } from '../lib/http';
import { mapServerError } from '../utils/errorMapper';

const BASE = '/api/tasks';

export async function createTask(title) {
  const res = await httpJSON(`${BASE}`, {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error(mapServerError(res.error));
  return res.data;
}

export async function toggleTask(id, done) {
  const opts = done === undefined
    ? { method: 'PATCH' }
    : { method: 'PATCH', body: JSON.stringify({ done: !!done }) };

  const res = await httpJSON(`${BASE}/${id}`, opts);
  if (!res.ok) throw new Error(mapServerError(res.error));
  return res.data;
}

export async function deleteTask(id) {
  const res = await httpJSON(`${BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) throw new Error(mapServerError(res.error));
  return true;
}
