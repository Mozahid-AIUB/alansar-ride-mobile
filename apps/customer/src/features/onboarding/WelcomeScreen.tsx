import type { ComponentType } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  ArrowRight,
  NavigationArrow,
  ShieldCheck,
  Wallet,
  type IconProps,
} from 'phosphor-react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { gradients, lightTheme, onHero } from '@alansar/theme';

import { PressableScale } from '@/components/PressableScale';

const { colors, spacing, radius, typography, controls, shadows } = lightTheme;

const logo = require('@alansar/assets/images/app_logo.png');

const highlights: { icon: ComponentType<IconProps>; title: string; body: string }[] = [
  { icon: ShieldCheck, title: 'Verified drivers', body: 'Every driver is checked and approved' },
  { icon: NavigationArrow, title: 'Live tracking', body: 'Follow your ride on the map in real time' },
  { icon: Wallet, title: 'Your fare', body: 'Agree on the price before you go' },
];

const enter = (delay: number) => FadeInDown.delay(delay).duration(520);

export function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <LinearGradient {...gradients.header} style={[styles.hero, { paddingTop: insets.top }]}>
        <View style={[styles.orb, styles.orbTop]} />
        <View style={[styles.orb, styles.orbBottom]} />

        <Animated.View entering={ZoomIn.duration(600).springify()} style={styles.logoTile}>
          <Image source={logo} style={styles.logo} contentFit="contain" />
        </Animated.View>
        <Animated.Text entering={enter(150)} style={styles.brand}>
          Al Ansar Ride
        </Animated.Text>
        <Animated.Text entering={enter(220)} style={styles.tagline}>
          Your ride, your fare
        </Animated.Text>
      </LinearGradient>

      <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Animated.Text entering={enter(300)} style={styles.headline}>
          Go anywhere,{'\n'}anytime.
        </Animated.Text>
        <Animated.Text entering={enter(360)} style={styles.subtitle}>
          Safe, reliable rides at a fare you agree on.
        </Animated.Text>

        <View style={styles.highlights}>
          {highlights.map(({ icon: Icon, title, body }, i) => (
            <Animated.View key={title} entering={enter(440 + i * 80)} style={styles.highlight}>
              <View style={styles.iconChip}>
                <Icon size={22} color={colors.primary} weight="duotone" />
              </View>
              <View style={styles.highlightText}>
                <Text style={styles.highlightTitle}>{title}</Text>
                <Text style={styles.highlightBody}>{body}</Text>
              </View>
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={enter(720)}>
          <PressableScale
            accessibilityRole="button"
            style={styles.primaryButton}
            onPress={() => router.push('/register')}
          >
            <Text style={styles.primaryLabel}>Get started</Text>
            <ArrowRight size={20} color={colors.onPrimary} weight="bold" />
          </PressableScale>
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <Pressable accessibilityRole="button" hitSlop={8} onPress={() => router.push('/login')}>
              <Text style={styles.loginLink}>Log in</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: radius.xl,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    borderRadius: radius.pill,
    backgroundColor: onHero.orb,
  },
  orbTop: {
    width: 320,
    height: 320,
    top: -120,
    right: -110,
  },
  orbBottom: {
    width: 220,
    height: 220,
    bottom: -40,
    left: -90,
  },
  logoTile: {
    width: 104,
    height: 104,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.raised,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: radius.lg,
  },
  brand: {
    ...typography.headline,
    color: onHero.text,
    marginTop: spacing.md,
  },
  tagline: {
    ...typography.bodySmall,
    color: onHero.textMuted,
    marginTop: spacing.xs,
  },
  sheet: {
    marginTop: -radius.xl,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    backgroundColor: colors.surface,
  },
  headline: {
    ...typography.display,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    lineHeight: 22,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  highlights: {
    gap: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  highlight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconChip: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightText: {
    flex: 1,
  },
  highlightTitle: {
    ...typography.titleSmall,
    color: colors.text,
  },
  highlightBody: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: 2,
  },
  primaryButton: {
    height: controls.buttonHeight,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    boxShadow: shadows.card,
  },
  primaryLabel: {
    ...typography.button,
    color: colors.onPrimary,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs + 2,
    marginTop: spacing.md,
  },
  loginText: {
    ...typography.body,
    color: colors.textMuted,
  },
  loginLink: {
    ...typography.titleSmall,
    color: colors.primary,
  },
});
