import { StyleSheet, Text } from 'react-native';
import { Info } from 'phosphor-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { lightTheme } from '@alansar/theme';

const { colors, radius, spacing, typography } = lightTheme;

/** Shown while Firebase sign-in is not connected (see packages/auth). */
export function PreviewNotice({ message }: { message: string }) {
  return (
    <Animated.View entering={FadeIn.duration(240)} style={styles.box} accessibilityRole="alert">
      <Info size={20} color={colors.primary} weight="duotone" />
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
  },
  text: {
    ...typography.bodySmall,
    flex: 1,
    lineHeight: 19,
    color: colors.textMuted,
  },
});
