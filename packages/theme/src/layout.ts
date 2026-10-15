/** Spacing, radius, shadows and control sizes, ported from the Flutter app. */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

/**
 * The one soft shadow used on every raised surface, as a `boxShadow` style
 * value (React Native New Architecture).
 */
export const shadows = {
  card: '0px 6px 18px rgba(16, 16, 20, 0.05)',
  raised: '0px 12px 28px rgba(16, 16, 20, 0.10)',
} as const;

export const controls = {
  /** Primary and outlined buttons are full-width pills of this height. */
  buttonHeight: 56,
  inputPaddingX: spacing.md,
  inputPaddingY: 18,
  borderWidth: 1,
  focusBorderWidth: 1.6,
} as const;
