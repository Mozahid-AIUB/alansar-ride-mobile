/**
 * Type scale in Plus Jakarta Sans. Each weight is its own font family (that is
 * how custom fonts work on Android), so tokens set `fontFamily`, never
 * `fontWeight`. The app loads these names with expo-font in its root layout.
 */
export const fonts = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
} as const;

/** Kept free of react-native imports so this package has no dependencies. */
type TextToken = {
  fontFamily: string;
  fontSize: number;
  lineHeight?: number;
  letterSpacing?: number;
};

export const typography = {
  display: { fontFamily: fonts.extrabold, fontSize: 32, lineHeight: 38, letterSpacing: -0.9 },
  headlineLarge: { fontFamily: fonts.extrabold, fontSize: 26, lineHeight: 32, letterSpacing: -0.6 },
  headline: { fontFamily: fonts.bold, fontSize: 21, lineHeight: 27, letterSpacing: -0.4 },
  title: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 22, letterSpacing: -0.2 },
  titleSmall: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20 },
  button: { fontFamily: fonts.bold, fontSize: 16, letterSpacing: -0.1 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22 },
  bodyStrong: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 22 },
  bodySmall: { fontFamily: fonts.regular, fontSize: 13.5, lineHeight: 19 },
  caption: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16 },
  label: { fontFamily: fonts.semibold, fontSize: 11, lineHeight: 14, letterSpacing: 0.3 },
} as const satisfies Record<string, TextToken>;
