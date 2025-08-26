export function mapServerError(errMsg = '') {
  const s = String(errMsg).toLowerCase();
  if (s.includes('title is required')) return 'Title is required';
  if (s.includes('title is too long')) return 'Title is too long (max 255)';
  return 'Something went wrong. Please try again.';
}
