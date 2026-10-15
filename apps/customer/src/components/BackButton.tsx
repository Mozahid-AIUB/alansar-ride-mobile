import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { CaretLeft } from 'phosphor-react-native';

import { lightTheme, onHero } from '@alansar/theme';

import { PressableScale } from './PressableScale';

const { colors, radius, controls } = lightTheme;

/** `onHero` is the frosted variant for the blue header gradient. */
export function BackButton({ tone = 'default' }: { tone?: 'default' | 'onHero' }) {
  const hero = tone === 'onHero';

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel="Back"
      hitSlop={8}
      style={[styles.button, hero ? styles.hero : styles.plain]}
      // A deep link can open a screen with nothing behind it.
      onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
    >
      <CaretLeft size={22} color={hero ? onHero.text : colors.text} weight="bold" />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    borderWidth: controls.borderWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plain: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  hero: {
    backgroundColor: onHero.glass,
    borderColor: onHero.glassBorder,
  },
});
