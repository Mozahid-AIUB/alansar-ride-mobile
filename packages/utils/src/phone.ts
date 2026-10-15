/**
 * Bangladeshi mobile numbers, matching the API's utils/phone.js.
 *
 * National form is 01XNNNNNNNN. Without the leading 0 that is a 10-digit
 * "significant" number starting with 1, where X (the operator digit) is 3–9.
 */
const BD_SIGNIFICANT = /^1[3-9]\d{8}$/;

/**
 * Reduce whatever was typed or pasted (`01712…`, `+880 1712…`, `8801712…`) to
 * the significant digits, capped at 10. Safe to call on every keystroke.
 */
export const bdSignificantDigits = (input: string): string => {
  let d = input.replace(/\D/g, '');
  if (d.startsWith('880')) d = d.slice(3);
  if (d.startsWith('0')) d = d.slice(1);
  return d.slice(0, 10);
};

export const isValidBdMobile = (significant: string): boolean => BD_SIGNIFICANT.test(significant);

/** `1712345678` → `+8801712345678`, the form the API stores. */
export const toE164Bd = (significant: string): string => `+880${significant}`;

/** `1712345678` → `1712-345678`, for display while typing. */
export const formatBdSignificant = (digits: string): string =>
  digits.length > 4 ? `${digits.slice(0, 4)}-${digits.slice(4)}` : digits;

/** `+8801712345678` → `+880 1712-345678`. */
export const formatBdPhone = (phone: string): string =>
  `+880 ${formatBdSignificant(bdSignificantDigits(phone))}`;
