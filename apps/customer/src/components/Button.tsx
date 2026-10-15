import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';

import { lightTheme } from '@alansar/theme';

import { PressableScale } from './PressableScale';

const { colors, radius, spacing, typography, controls, shadows } = lightTheme;

type Props = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
};

/** Full-width pill button. Primary is the one main action on a screen. */
export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  leading,
  trailing,
}: Props) {
  const primary = variant === 'primary';
  const inactive = disabled || loading;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      style={[
        styles.base,
        primary ? styles.primary : styles.outline,
        primary && inactive && styles.primaryInactive,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={primary ? colors.onPrimary : colors.text} />
      ) : (
        <>
          {leading}
          <Text style={[styles.label, primary ? styles.labelPrimary : styles.labelOutline]}>
            {label}
          </Text>
          {trailing}
        </>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    height: controls.buttonHeight,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  primary: {
    backgroundColor: colors.primary,
    boxShadow: shadows.card,
  },
  primaryInactive: {
    backgroundColor: colors.disabled,
    boxShadow: 'none',
  },
  outline: {
    backgroundColor: colors.surface,
    borderWidth: controls.borderWidth,
    borderColor: colors.border,
  },
  label: {
    ...typography.button,
  },
  labelPrimary: {
    color: colors.onPrimary,
  },
  labelOutline: {
    color: colors.text,
  },
});
