/** `250` / `"250.00"` → `৳250`. Empty for a missing value. */
export const formatTaka = (value: string | number | null | undefined): string => {
  const n = typeof value === 'string' ? Number(value) : value;
  return n === null || n === undefined || Number.isNaN(n) ? '' : `৳${Math.round(n).toLocaleString('en-US')}`;
};

/** ISO timestamp → `16 Oct, 10:24`. */
export const formatRideDate = (iso: string | undefined): string => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const day = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return `${day}, ${time}`;
};

/** "Rahim Uddin" → "RU". */
export const initialsOf = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
