import { useEffect, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { useT } from '@alansar/i18n';
import { fonts, lightTheme, onHero } from '@alansar/theme';

import { Button } from '@/components/Button';
import { GoogleLogo } from '@/components/GoogleLogo';

const { colors, spacing, typography } = lightTheme;

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

/** The two legal links, "<Terms> and <Privacy Policy>", emphasised inline. */
export function LegalLinks({ short = false }: { short?: boolean }) {
  const t = useT();
  return (
    <>
      <Text style={styles.inlineLink}>{short ? t('auth.termsShort') : t('legal.terms.title')}</Text>
      {t('auth.and')}
      <Text style={styles.inlineLink}>{t('legal.privacyWord')}</Text>
    </>
  );
}

/** The full "By continuing, you agree to our <Terms> and <Privacy Policy>." line. */
export function LegalTerms() {
  const t = useT();
  const parts = t('legal.termsAnd').split(/\{terms\}|\{privacy\}/);
  return (
    <>
      {parts[0]}
      <Text style={styles.inlineLink}>{t('legal.terms.title')}</Text>
      {parts[1]}
      <Text style={styles.inlineLink}>{t('legal.privacyWord')}</Text>
      {parts[2]}
    </>
  );
}

/** Emphasis inside a header subtitle, e.g. the address a code was sent to. */
export function HeroStrong({ children }: { children: ReactNode }) {
  return <Text style={styles.heroStrong}>{children}</Text>;
}

/** "Resend code in 0:27", then a Resend link once the cooldown ends. */
export function ResendCode({ seconds = 30, onResend }: { seconds?: number; onResend?: () => void }) {
  const t = useT();
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    if (left === 0) return;
    const timer = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [left]);

  if (left > 0) {
    return <Text style={styles.muted}>{t('auth.resendIn', { time: `0:${String(left).padStart(2, '0')}` })}</Text>;
  }
  return (
    <TextLink
      label={t('auth.resendCode')}
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
