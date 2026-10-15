import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { authReady } from '@alansar/auth';
import { lightTheme } from '@alansar/theme';
import { formatBdPhone } from '@alansar/utils';

import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/Button';

import { CodeInput } from './CodeInput';
import { PreviewNotice } from './PreviewNotice';

const { colors, spacing, typography } = lightTheme;

const CODE_LENGTH = 6;
const RESEND_AFTER_SECONDS = 30;

const enter = (delay: number) => FadeInDown.delay(delay).duration(480);

export function VerifyScreen() {
  const insets = useSafeAreaInsets();
  const { phone = '' } = useLocalSearchParams<{ phone: string }>();
  const [code, setCode] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(RESEND_AFTER_SECONDS);

  useEffect(() => {
    if (secondsLeft === 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.lg },
        ]}
      >
        <BackButton />

        <Animated.Text entering={enter(0)} style={styles.title}>
          Enter the 6-digit code
        </Animated.Text>
        <Animated.View entering={enter(60)} style={styles.sentTo}>
          <Text style={styles.subtitle}>
            Sent to <Text style={styles.phone}>{formatBdPhone(phone)}</Text>
          </Text>
          <Pressable accessibilityRole="button" hitSlop={8} onPress={() => router.back()}>
            <Text style={styles.link}>Edit</Text>
          </Pressable>
        </Animated.View>

        <Animated.View entering={enter(120)} style={styles.code}>
          <CodeInput value={code} onChange={setCode} length={CODE_LENGTH} />
        </Animated.View>

        <Animated.View entering={enter(180)} style={styles.resend}>
          {secondsLeft > 0 ? (
            <Text style={styles.muted}>
              Resend code in 0:{String(secondsLeft).padStart(2, '0')}
            </Text>
          ) : (
            <Pressable
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => setSecondsLeft(RESEND_AFTER_SECONDS)}
            >
              <Text style={styles.link}>Resend code</Text>
            </Pressable>
          )}
        </Animated.View>

        {!authReady ? (
          <PreviewNotice message="Preview: no SMS was sent, so any 6 digits continue. Real codes are checked once Firebase is connected." />
        ) : null}

        <View style={styles.spacer} />

        <Animated.View entering={enter(240)}>
          <Button
            label="Verify"
            disabled={code.length < CODE_LENGTH}
            // Preview walks on to sign-up; the real flow sends existing users home instead.
            onPress={() => {
              if (!authReady) router.push('/profile');
            }}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.headlineLarge,
    color: colors.text,
    marginTop: spacing.lg,
  },
  sentTo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  phone: {
    color: colors.text,
    fontWeight: '600',
  },
  code: {
    marginTop: spacing.xl,
  },
  resend: {
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
