import { useEffect, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { fonts, lightTheme, onHero } from '@alansar/theme';

import { Button } from '@/components/Button';
import { GoogleLogo } from '@/components/GoogleLogo';

const { colors, spacing, typography } = lightTheme;

export const INVALID_PHONE = 'Enter a valid Bangladeshi mobile number';
export const INVALID_EMAIL = 'Enter a valid email address';

/** Back to Log in without stacking a second copy of it. */
export const backToLogin = () => (router.canGoBack() ? router.back() : router.replace('/login'));

export function OrDivider({ label }: { label: string }) {
  return (
    <View style={styles.or}>
      <View style={styles.rule} />
      <Text style={styles.orText}>{label}</Text>
      <View style={styles.rule} />
    </View>
  );
}

export function GoogleButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Button variant="outline" label={label} leading={<GoogleLogo size={20} />} onPress={onPress} />
  );
}

/** "Don't have an account? Sign up" */
export function SwitchPrompt({
  question,
  action,
  onPress,
}: {
  question: string;
  action: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.switchRow}>
      <Text style={styles.switchText}>{question}</Text>
      <TextLink label={action} onPress={onPress} />
    </View>
  );
}

export function TextLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" hitSlop={8} onPress={onPress}>
      <Text style={styles.link}>{label}</Text>
    </Pressable>
  );
}

/** `short` says "Terms" instead of "Terms of Service", to keep a checkbox label on one line. */
export function LegalLinks({ short = false }: { short?: boolean }) {
  return (
    <>
      <Text style={styles.inlineLink}>{short ? 'Terms' : 'Terms of Service'}</Text> and{' '}
      <Text style={styles.inlineLink}>Privacy Policy</Text>
    </>
  );
}

/** Emphasis inside a header subtitle, e.g. the address a code was sent to. */
export function HeroStrong({ children }: { children: ReactNode }) {
  return <Text style={styles.heroStrong}>{children}</Text>;
}

/** "Resend code in 0:27", then a Resend link once the cooldown ends. */
export function ResendCode({ seconds = 30, onResend }: { seconds?: number; onResend?: () => void }) {
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    if (left === 0) return;
    const timer = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [left]);

  if (left > 0) {
    return <Text style={styles.muted}>Resend code in 0:{String(left).padStart(2, '0')}</Text>;
  }
  return (
    <TextLink
      label="Resend code"
      onPress={() => {
        setLeft(seconds);
        onResend?.();
      }}
    />
  );
}

const styles = StyleSheet.create({
  or: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  rule: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  orText: {
    ...typography.bodySmall,
    color: colors.textSubtle,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  switchText: {
    ...typography.body,
    color: colors.textMuted,
  },
  link: {
    ...typography.titleSmall,
    color: colors.brandStrong,
  },
  inlineLink: {
    fontFamily: fonts.semibold,
    color: colors.brandStrong,
  },
  heroStrong: {
    fontFamily: fonts.bold,
    color: onHero.text,
  },
  muted: {
    ...typography.bodySmall,
    color: colors.textSubtle,
  },
});
