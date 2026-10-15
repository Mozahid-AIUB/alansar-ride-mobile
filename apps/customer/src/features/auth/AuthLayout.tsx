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

/** Logo and heading on the brand gradient, form on a white sheet: every sign-in screen. */
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

        <View style={styles.back}>
          <BackButton tone="onHero" />
        </View>

        <Animated.View entering={ZoomIn.duration(520).springify()} style={styles.logoTile}>
          <Image source={logo} style={styles.logo} contentFit="contain" />
        </Animated.View>
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
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: radius.xl + spacing.lg,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    borderRadius: radius.pill,
    backgroundColor: onHero.orb,
  },
  orbTop: {
    width: 260,
    height: 260,
    top: -110,
    right: -70,
  },
  orbBottom: {
    width: 160,
    height: 160,
    bottom: -60,
    left: -50,
  },
  back: {
    alignSelf: 'flex-start',
  },
  logoTile: {
    width: 88,
    height: 88,
    borderRadius: radius.xl - 4,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.raised,
    marginTop: spacing.xs,
  },
  logo: {
    width: 68,
    height: 68,
    borderRadius: radius.md,
  },
  title: {
    ...typography.headlineLarge,
    color: onHero.text,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  subtitle: {
    ...typography.body,
    lineHeight: 22,
    color: onHero.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  sheet: {
    flex: 1,
    marginTop: -radius.xl,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    backgroundColor: colors.surface,
  },
});
