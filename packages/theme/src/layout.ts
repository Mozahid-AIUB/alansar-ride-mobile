/** Spacing, radius, shadows and control sizes. Corners are crisp rather than pill-round. */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

/** `boxShadow` values (React Native New Architecture). Tight and low, like print. */
export const shadows = {
  card: '0px 1px 2px rgba(15, 27, 36, 0.06), 0px 4px 14px rgba(15, 27, 36, 0.06)',
  raised: '0px 2px 6px rgba(15, 27, 36, 0.08), 0px 14px 34px rgba(15, 27, 36, 0.14)',
} as const;

export const controls = {
  buttonHeight: 56,
  buttonRadius: 14,
  /** Text fields sit a little lower than buttons so long forms fit one screen. */
  inputHeight: 52,
  inputPaddingX: spacing.md,
  borderWidth: 1,
  focusBorderWidth: 1.6,
} as const;
