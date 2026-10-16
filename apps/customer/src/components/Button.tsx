import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';

import { lightTheme } from '@alansar/theme';

import { PressableScale } from './PressableScale';

const { colors, spacing, typography, controls, shadows } = lightTheme;

type Props = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'outline' | 'danger';
  /** `sm` is a compact 40px button for inline actions, e.g. in a list row. */
  size?: 'md' | 'sm';
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
  size = 'md',
  disabled = false,
  loading = false,
  leading,
  trailing,
}: Props) {
  const primary = variant === 'primary';
  const danger = variant === 'danger';
  const small = size === 'sm';
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
        small && styles.small,
        primary ? styles.primary : danger ? styles.danger : styles.outline,
        primary && inactive && styles.primaryInactive,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={primary || danger ? colors.onPrimary : colors.text} />
      ) : (
        <>
          {leading}
          <Text
            style={[
              styles.label,
              small && styles.labelSmall,
              primary || danger ? styles.labelPrimary : styles.labelOutline,
            ]}
          >
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
    borderRadius: controls.buttonRadius,
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
  small: {
    height: 40,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
  },
  danger: {
    backgroundColor: colors.danger,
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
  labelSmall: {
    ...typography.titleSmall,
  },
  labelPrimary: {
    color: colors.onPrimary,
  },
  labelOutline: {
    color: colors.text,
  },
});
