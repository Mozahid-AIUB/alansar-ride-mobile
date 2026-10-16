/**
 * Colour tokens. The brand comes straight from the logo: a near-black navy
 * ("ink") and a lime-to-forest green. Ink carries the primary actions and the
 * header, Uber-style; green marks the brand moments — focus, links, routes,
 * availability.
 */

/** Raw ramps. Components should use `lightColors` / `darkColors` instead. */
export const palette = {
  ink950: '#0A1218',
  ink900: '#0F1B24',
  ink800: '#16242F',
  ink700: '#213240',
  ink500: '#4F5E69',
  ink400: '#7A8893',
  ink300: '#9BA7B0',
  ink200: '#C8D0D6',
  ink150: '#E2E7EB',
  ink100: '#EEF1F4',
  ink50: '#F5F7F8',

  /** The bright end of the logo's green. */
  lime: '#7CC21F',
  green400: '#3FAE45',
  green500: '#23963A',
  /** Dark enough (≥ 4.5:1 on white) for green text. */
  green600: '#1B7E30',
  green700: '#14612A',
  green50: '#EAF6E7',

  white: '#FFFFFF',

  // Status colours are a contract with the admin panel: a "cancelled" ride
  // must look the same in both places.
  success: '#22C55E',
  info: '#3B82F6',
  warning: '#F5A623',
  danger: '#EF4444',
  star: '#F5A623',
  gray400: '#9CA3AF',

  // Dark theme surfaces.
  night900: '#0E1116',
  night800: '#10141B',
  night700: '#171B22',
  night600: '#1D222B',
  night500: '#232833',
  night400: '#262C36',
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
  /** The main call to action. */
  primary: string;
  onPrimary: string;
  primaryTint: string;
  /** Brand green for focus, links, routes and availability. */
  brand: string;
  /** Brand green dark enough for text. */
  brandStrong: string;
  brandTint: string;
  /** Destination pins and markers. */
  accent: string;
  accentTint: string;
  pickup: string;
  dropoff: string;
  inputFill: string;
  disabled: string;
  dangerTint: string;
  successTint: string;
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
  background: palette.ink50,
  backgroundAlt: palette.ink100,
  surface: palette.white,
  surfaceAlt: palette.ink100,
  border: palette.ink150,
  borderSubtle: palette.ink100,
  text: palette.ink900,
  textMuted: palette.ink500,
  textSubtle: palette.ink400,
  placeholder: palette.ink300,
  primary: palette.ink900,
  onPrimary: palette.white,
  primaryTint: palette.ink100,
  brand: palette.green500,
  brandStrong: palette.green600,
  brandTint: palette.green50,
  accent: palette.danger,
  accentTint: 'rgba(239, 68, 68, 0.10)',
  pickup: palette.green500,
  dropoff: palette.ink900,
  inputFill: palette.ink50,
  disabled: palette.ink200,
  dangerTint: 'rgba(239, 68, 68, 0.08)',
  successTint: 'rgba(35, 150, 58, 0.10)',
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
  primary: palette.green400,
  onPrimary: palette.ink950,
  primaryTint: 'rgba(63, 174, 69, 0.16)',
  brand: palette.green400,
  brandStrong: palette.lime,
  brandTint: 'rgba(63, 174, 69, 0.16)',
  accent: palette.danger,
  accentTint: 'rgba(239, 68, 68, 0.16)',
  pickup: palette.green400,
  dropoff: palette.snow,
  inputFill: palette.night600,
  disabled: palette.night400,
  dangerTint: 'rgba(239, 68, 68, 0.16)',
  successTint: 'rgba(63, 174, 69, 0.16)',
  ...status,
};

/** Overlays for content sitting on the ink header. */
export const onHero = {
  text: palette.white,
  textMuted: 'rgba(255, 255, 255, 0.70)',
  /** Body copy on a coloured banner. */
  textSoft: 'rgba(255, 255, 255, 0.88)',
  orb: 'rgba(255, 255, 255, 0.05)',
  /** Frosted control surface, e.g. the back button. */
  glass: 'rgba(255, 255, 255, 0.10)',
  glassBorder: 'rgba(255, 255, 255, 0.16)',
  /** Streets and blocks in the map illustration. */
  street: 'rgba(255, 255, 255, 0.07)',
  block: 'rgba(255, 255, 255, 0.035)',
} as const;

/** For expo-linear-gradient: `<LinearGradient {...gradients.header} />`. */
export const gradients = {
  header: {
    colors: [palette.ink950, palette.ink800],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  brand: {
    colors: [palette.lime, palette.green600],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
} as const;
