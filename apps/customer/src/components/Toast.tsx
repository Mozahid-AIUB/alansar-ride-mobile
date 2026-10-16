import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

import { lightTheme } from '@alansar/theme';

const { colors, radius, spacing, typography, shadows } = lightTheme;

/** A short-lived message: `const toast = useToast(); toast.show('Saved')`, then render `<Toast {...toast} />`. */
export function useToast(durationMs = 2400) {
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), durationMs);
    return () => clearTimeout(timer);
  }, [toast, durationMs]);

  return {
    toast,
    show: (message: string) => setToast({ id: Date.now(), message }),
  };
}

export function Toast({ toast }: { toast: { id: number; message: string } | null }) {
  if (!toast) return null;
  return (
    <Animated.View
      key={toast.id}
      entering={FadeInDown.duration(220)}
      exiting={FadeOutDown.duration(180)}
      style={styles.toast}
      pointerEvents="none"
      accessibilityLiveRegion="polite"
    >
      <Text style={styles.text}>{toast.message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.md,
    paddingVertical: spacing.sm + 6,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    boxShadow: shadows.raised,
  },
  text: {
    ...typography.bodyStrong,
    color: colors.onPrimary,
    textAlign: 'center',
  },
});
