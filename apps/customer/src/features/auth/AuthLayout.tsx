import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { gradients, lightTheme, onHero } from '@alansar/theme';

import { BackButton } from '@/components/BackButton';

const { colors, spacing, radius, typography, shadows } = lightTheme;

const logo = require('@alansar/assets/images/app_logo.png');

type Props = {
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
};

/**
 * Compact brand header over a white sheet: the frame for every sign-in screen.
 * The header clears the status bar and the sheet clears the home indicator, so
 * nothing sits under system UI. Content scrolls only if a screen is too short.
 */
export function AuthLayout({ title, subtitle, children }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      bounces={false}
    >
      <StatusBar style="light" />
      <LinearGradient
        {...gradients.header}
        style={[styles.hero, { paddingTop: insets.top + spacing.sm }]}
      >
        <View style={[styles.orb, styles.orbTop]} />
        <View style={[styles.orb, styles.orbBottom]} />

        <View style={styles.topRow}>
          <BackButton tone="onHero" />
          <Animated.View
            entering={ZoomIn.duration(520).springify()}
            style={styles.logoTile}
            pointerEvents="none"
          >
            <Image source={logo} style={styles.logo} contentFit="contain" />
          </Animated.View>
          {/* Balances the back button so the logo sits dead centre. */}
          <View style={styles.balance} />
        </View>

        <Animated.Text entering={FadeInDown.delay(80).duration(460)} style={styles.title}>
          {title}
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(140).duration(460)} style={styles.subtitle}>
          {subtitle}
        </Animated.Text>
      </LinearGradient>

      <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    flexGrow: 1,
  },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingBottom: radius.xl + spacing.sm + 4,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    borderRadius: radius.pill,
    backgroundColor: onHero.orb,
  },
  orbTop: {
    width: 240,
    height: 240,
    top: -120,
    right: -70,
  },
  orbBottom: {
    width: 140,
    height: 140,
    bottom: -60,
    left: -50,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balance: {
    width: 44,
  },
  logoTile: {
    width: 60,
    height: 60,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.raised,
  },
  logo: {
    width: 46,
    height: 46,
    borderRadius: radius.sm,
  },
  title: {
    ...typography.headlineLarge,
    color: onHero.text,
    textAlign: 'center',
    marginTop: spacing.sm + 4,
  },
  subtitle: {
    ...typography.bodySmall,
    lineHeight: 20,
    color: onHero.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  sheet: {
    flex: 1,
    marginTop: -radius.xl,
    paddingTop: spacing.md + 4,
    paddingHorizontal: spacing.lg,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    backgroundColor: colors.surface,
  },
});
