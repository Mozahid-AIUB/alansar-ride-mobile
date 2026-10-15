/** Shape check only; the API does the authoritative validation (including typo hints). */
export const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
