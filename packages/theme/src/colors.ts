/**
 * Colour tokens, ported from the Flutter app
 * (lib/core/theme/app_theme.dart → AppColors and BookingColors).
 *
 * Light theme is the blue system: blue gradient header, deep-blue primary
 * actions, white cards on a cool off-white canvas. Dark theme is the booking-flow
 * palette from the approved mockups.
 *
 * Open design question: in light mode the primary action is blue, in dark mode
 * it is green (the mockup's accent). That was fine while dark only covered the
 * three booking screens; decide on one before making dark mode app-wide.
 */

/** Raw ramps. Components should use `lightColors` / `darkColors` instead. */
export const palette = {
  brand50: '#EFF5FB',
  brand100: '#DCE9F6',
  brand200: '#BBD3EC',
  brand300: '#8DB5DE',
  brand400: '#5B93CB',
  brand500: '#1B5C9E',
  brand600: '#175291',
  brand700: '#12406F',

  /** Lighter blue at the top-left of the header gradient. */
  sunrise: '#3E7CB2',

  /** Near-black navy for headings. */
  ink: '#13273D',
  inkSoft: '#1E3A56',
  inkMuted: '#6B8095',

  canvas: '#F1F3F5',
  white: '#FFFFFF',

  // Status colours are a contract with the admin panel: a "cancelled" ride
  // must look the same in both places.
  success: '#22C55E',
  info: '#3B82F6',
  warning: '#F5A623',
  danger: '#EF4444',
  star: '#F5A623',

  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray900: '#111827',

  // Booking-flow dark mockup.
  night900: '#0E1116',
  night800: '#10141B',
  night700: '#171B22',
  night600: '#1D222B',
  night500: '#232833',
  night400: '#262C36',
  mint: '#3AC48C',
  coral: '#FF6B57',
  snow: '#F4F5F7',
  mist400: '#8A9099',
  mist500: '#6B7078',
  mist600: '#565D68',
} as const;

/** Semantic roles. Both themes define every key, so a component works in either. */
export type ThemeColors = {
  background: string;
  backgroundAlt: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  borderSubtle: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  placeholder: string;
  primary: string;
  onPrimary: string;
  /** Tinted chip behind a primary-coloured icon. */
  primaryTint: string;
  /** Destination pins and markers only — never a button colour. */
  accent: string;
  accentTint: string;
  pickup: string;
  dropoff: string;
  inputFill: string;
  disabled: string;
  success: string;
  info: string;
  warning: string;
  danger: string;
  star: string;
};

const status = {
  success: palette.success,
  info: palette.info,
  warning: palette.warning,
  danger: palette.danger,
  star: palette.star,
};

export const lightColors: ThemeColors = {
  background: palette.canvas,
  backgroundAlt: palette.gray50,
  surface: palette.white,
  surfaceAlt: palette.brand50,
  border: palette.gray200,
  borderSubtle: palette.gray100,
  text: palette.ink,
  textMuted: palette.gray600,
  textSubtle: palette.gray500,
  placeholder: palette.gray400,
  primary: palette.brand500,
  onPrimary: palette.white,
  primaryTint: palette.brand50,
  accent: palette.brand500,
  accentTint: palette.brand100,
  pickup: palette.ink,
  dropoff: palette.brand500,
  inputFill: palette.gray50,
  disabled: palette.gray300,
  ...status,
};

export const darkColors: ThemeColors = {
  background: palette.night800,
  backgroundAlt: palette.night900,
  surface: palette.night700,
  surfaceAlt: palette.night600,
  border: palette.night400,
  borderSubtle: palette.night500,
  text: palette.snow,
  textMuted: palette.mist400,
  textSubtle: palette.mist500,
  placeholder: palette.mist600,
  primary: palette.mint,
  // Near-black on mint, not white — the mockup's high-contrast choice.
  onPrimary: palette.night900,
  primaryTint: 'rgba(58, 196, 140, 0.16)',
  accent: palette.coral,
  accentTint: 'rgba(255, 107, 87, 0.16)',
  pickup: palette.mint,
  dropoff: palette.coral,
  inputFill: palette.night600,
  disabled: palette.night400,
  ...status,
};

/** White overlays for content sitting on the blue header gradient. */
export const onHero = {
  text: palette.white,
  textMuted: 'rgba(255, 255, 255, 0.78)',
  orb: 'rgba(255, 255, 255, 0.08)',
} as const;

/** For expo-linear-gradient: `<LinearGradient {...gradients.header} />`. */
export const gradients = {
  header: {
    colors: [palette.sunrise, palette.brand500],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  cardWash: {
    colors: [palette.brand50, palette.white],
    start: { x: 1, y: 0 },
    end: { x: 0, y: 1 },
  },
} as const;
