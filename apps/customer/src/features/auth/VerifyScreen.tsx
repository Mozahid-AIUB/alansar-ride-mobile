import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { authReady } from '@alansar/auth';
import { lightTheme, onHero } from '@alansar/theme';
import { formatBdPhone } from '@alansar/utils';

import { Button } from '@/components/Button';

import { AuthLayout } from './AuthLayout';
import { CodeInput } from './CodeInput';
import { PreviewNotice } from './PreviewNotice';

const { colors, spacing, typography } = lightTheme;

const CODE_LENGTH = 6;
const RESEND_AFTER_SECONDS = 30;

type Params = { mode?: 'login' | 'register'; phone?: string; name?: string; email?: string };

export function VerifyScreen() {
  const { mode = 'login', phone = '' } = useLocalSearchParams<Params>();
  const [code, setCode] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(RESEND_AFTER_SECONDS);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (secondsLeft === 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const registering = mode === 'register';

  return (
    <AuthLayout
      title="Verify your number"
      subtitle={
        <>
          Enter the 6-digit code sent to{' '}
          <Text style={styles.phone}>{formatBdPhone(phone)}</Text>
        </>
      }
    >
      <CodeInput value={code} onChange={setCode} length={CODE_LENGTH} />

      <View style={styles.row}>
        {secondsLeft > 0 ? (
          <Text style={styles.muted}>Resend code in 0:{String(secondsLeft).padStart(2, '0')}</Text>
        ) : (
          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => setSecondsLeft(RESEND_AFTER_SECONDS)}
          >
            <Text style={styles.link}>Resend code</Text>
          </Pressable>
        )}
        <Pressable accessibilityRole="button" hitSlop={8} onPress={() => router.back()}>
          <Text style={styles.link}>Change number</Text>
        </Pressable>
      </View>

      {!authReady ? (
        <PreviewNotice
          message={
            submitted
              ? `Preview: in the live app this ${registering ? 'creates your account' : 'logs you in'}.`
              : 'Preview: no SMS was sent. Real codes are checked once Firebase is connected.'
          }
        />
      ) : null}

      <View style={styles.spacer} />

      <Button
        label={registering ? 'Verify and create account' : 'Verify and log in'}
        disabled={code.length < CODE_LENGTH}
        onPress={() => setSubmitted(true)}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  phone: {
    color: onHero.text,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  muted: {
    ...typography.bodySmall,
    color: colors.textSubtle,
  },
  link: {
    ...typography.titleSmall,
    color: colors.primary,
  },
  spacer: {
    flex: 1,
    minHeight: spacing.xl,
  },
});
