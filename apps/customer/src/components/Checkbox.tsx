import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check } from 'phosphor-react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { lightTheme } from '@alansar/theme';

const { colors, spacing, typography, controls } = lightTheme;

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
};

export function Checkbox({ checked, onChange, children }: Props) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      hitSlop={6}
      onPress={() => onChange(!checked)}
      style={styles.row}
    >
      <View style={[styles.box, checked && styles.checked]}>
        {checked ? (
          <Animated.View entering={ZoomIn.duration(160)}>
            <Check size={14} color={colors.onPrimary} weight="bold" />
          </Animated.View>
        ) : null}
      </View>
      <Text style={styles.label}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: controls.focusBorderWidth,
    borderColor: colors.disabled,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    borderColor: colors.brand,
    backgroundColor: colors.brand,
  },
  label: {
    ...typography.bodySmall,
    flex: 1,
    lineHeight: 19,
    color: colors.textMuted,
  },
});
