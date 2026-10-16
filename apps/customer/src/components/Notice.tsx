import { StyleSheet, Text } from 'react-native';
import { CheckCircle, Info, WarningCircle } from 'phosphor-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { lightTheme } from '@alansar/theme';

const { colors, radius, spacing, typography } = lightTheme;

type Tone = 'info' | 'error' | 'success';

const TONES = {
  info: { icon: Info, color: colors.primary, background: colors.surfaceAlt },
  error: { icon: WarningCircle, color: colors.danger, background: colors.dangerTint },
  success: { icon: CheckCircle, color: colors.success, background: colors.successTint },
} as const;

/** Inline message box, e.g. a failed sign-in or a "code sent" confirmation. */
export function Notice({ message, tone = 'info' }: { message: string; tone?: Tone }) {
  const { icon: Icon, color, background } = TONES[tone];

  return (
    <Animated.View
      entering={FadeIn.duration(240)}
      style={[styles.box, { backgroundColor: background }]}
      accessibilityRole="alert"
    >
      <Icon size={20} color={color} weight="duotone" />
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md - 2,
    borderRadius: radius.md,
  },
  text: {
    ...typography.bodySmall,
    flex: 1,
    lineHeight: 19,
    color: colors.text,
  },
});
