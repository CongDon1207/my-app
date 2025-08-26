export const TITLE_MAX = 255;

export function validateTaskTitle(raw) {
  const value = (raw ?? '').toString();
  const t = value.trim();
  if (t.length === 0) return { ok: false, message: 'Title is required', value: t };
  if (t.length > TITLE_MAX) return { ok: false, message: `Title is too long (max ${TITLE_MAX})`, value: t };
  return { ok: true, message: null, value: t };
}
