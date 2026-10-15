import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CaretLeft } from 'phosphor-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { lightTheme } from '@alansar/theme';

import { PressableScale } from '@/components/PressableScale';

const { colors, spacing, radius, typography } = lightTheme;

/** Placeholder until the sign-in flow is built (phase 2, step 1). */
export function LoginScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.sm }]}>
      <StatusBar style="dark" />
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Back"
        style={styles.back}
        onPress={() => router.back()}
      >
        <CaretLeft size={22} color={colors.text} weight="bold" />
      </PressableScale>

      <Animated.Text entering={FadeInDown.duration(480)} style={styles.title}>
        Welcome back
      </Animated.Text>
      <Animated.Text entering={FadeInDown.delay(80).duration(480)} style={styles.body}>
        Sign-in with phone and OTP is the next screen we build.
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  back: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.headlineLarge,
    color: colors.text,
  },
  body: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
});
