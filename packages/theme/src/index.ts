import { darkColors, lightColors, type ThemeColors } from './colors';
import { controls, radius, shadows, spacing } from './layout';
import { typography } from './typography';

export * from './colors';
export * from './layout';
export * from './typography';
export * from './status';

export type Theme = {
  mode: 'light' | 'dark';
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  shadows: typeof shadows;
  controls: typeof controls;
  typography: typeof typography;
};

const shared = { spacing, radius, shadows, controls, typography };

export const lightTheme: Theme = { mode: 'light', colors: lightColors, ...shared };
export const darkTheme: Theme = { mode: 'dark', colors: darkColors, ...shared };
