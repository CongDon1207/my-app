export async function httpJSON(url, options) {
  let res;
  try {
    res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
      ...options,
    });
  } catch {
    return { ok: false, error: 'Network error. Please check your connection.' };
  }

  let data = null;
  try { data = await res.json(); } catch {}

  if (!res.ok) {
    const msg = data?.error || `Request failed (${res.status})`;
    return { ok: false, status: res.status, error: msg, data };
  }
  return { ok: true, data };
}
