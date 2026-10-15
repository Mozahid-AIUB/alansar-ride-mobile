import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { CaretLeft } from 'phosphor-react-native';

import { lightTheme } from '@alansar/theme';

import { PressableScale } from './PressableScale';

const { colors, radius, controls } = lightTheme;

export function BackButton() {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel="Back"
      hitSlop={8}
      style={styles.button}
      // A deep link can open a screen with nothing behind it.
      onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
    >
      <CaretLeft size={22} color={colors.text} weight="bold" />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: controls.borderWidth,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
