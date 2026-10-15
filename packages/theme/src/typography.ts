/** Kept free of react-native imports so this package has no dependencies. */
type TextToken = {
  fontSize: number;
  lineHeight?: number;
  fontWeight?: '600' | '700' | '800';
  letterSpacing?: number;
};

/**
 * Type scale, ported from the Flutter app's TextTheme.
 *
 * The Flutter app used the platform font (Roboto / San Francisco). Pick a brand
 * font plus a Bangla font (e.g. Hind Siliguri or Noto Sans Bengali) and set
 * `fontFamily` here once they are loaded with expo-font.
 */
export const typography = {
  /** Onboarding headline. */
  display: { fontSize: 34, lineHeight: 39, fontWeight: '700', letterSpacing: -1 },
  headlineLarge: { fontSize: 28, fontWeight: '700', letterSpacing: -0.6 },
  headline: { fontSize: 22, fontWeight: '700', letterSpacing: -0.4 },
  /** App bar titles. */
  title: { fontSize: 17, fontWeight: '700', letterSpacing: -0.2 },
  titleSmall: { fontSize: 15, fontWeight: '600' },
  button: { fontSize: 16, fontWeight: '700', letterSpacing: -0.1 },
  body: { fontSize: 15 },
  bodySmall: { fontSize: 13.5 },
  caption: { fontSize: 12 },
  label: { fontSize: 11, fontWeight: '600', letterSpacing: 0.2 },
} as const satisfies Record<string, TextToken>;
