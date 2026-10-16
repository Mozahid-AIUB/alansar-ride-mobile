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

/** ISO timestamp → `Just now`, `5m ago`, `3h ago`, `Yesterday`, `4d ago`, then `12 Oct`. */
export const formatTimeAgo = (iso: string | undefined, now = Date.now()): string => {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const minutes = Math.floor(Math.max(0, now - then) / 60_000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

/** "Rahim Uddin" → "RU". */
export const initialsOf = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
