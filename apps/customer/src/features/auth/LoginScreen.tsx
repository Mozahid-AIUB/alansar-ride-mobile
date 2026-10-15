import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'phosphor-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { authReady } from '@alansar/auth';
import { lightTheme } from '@alansar/theme';
import { isValidBdMobile, toE164Bd } from '@alansar/utils';

import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/Button';
import { GoogleLogo } from '@/components/GoogleLogo';

import { PhoneField } from './PhoneField';
import { PreviewNotice } from './PreviewNotice';

const { colors, spacing, typography } = lightTheme;

const enter = (delay: number) => FadeInDown.delay(delay).duration(480);

/** Sign in or sign up — one flow. A new number simply creates the account after the code. */
export function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState('');
  const [googleTapped, setGoogleTapped] = useState(false);

  const valid = isValidBdMobile(phone);
  const error =
    phone.length === 10 && !valid ? 'Enter a valid Bangladeshi mobile number' : undefined;

  const onContinue = () => {
    if (!valid) return;
    router.push({ pathname: '/verify', params: { phone: toE164Bd(phone) } });
  };

  const onGoogle = () => {
    if (!authReady) setGoogleTapped(true);
  };

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
          Enter your mobile number
        </Animated.Text>
        <Animated.Text entering={enter(60)} style={styles.subtitle}>
          We'll text you a code to sign in or create your account.
        </Animated.Text>

        <Animated.View entering={enter(120)} style={styles.field}>
          <PhoneField value={phone} onChange={setPhone} error={error} onSubmit={onContinue} />
        </Animated.View>

        <Animated.View entering={enter(180)}>
          <Button
            label="Continue"
            disabled={!valid}
            onPress={onContinue}
            trailing={<ArrowRight size={20} color={colors.onPrimary} weight="bold" />}
          />
        </Animated.View>

        <Animated.View entering={enter(240)} style={styles.or}>
          <View style={styles.rule} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.rule} />
        </Animated.View>

        <Animated.View entering={enter(300)}>
          <Button
            variant="outline"
            label="Continue with Google"
            leading={<GoogleLogo size={20} />}
            onPress={onGoogle}
          />
        </Animated.View>

        {googleTapped ? (
          <View style={styles.notice}>
            <PreviewNotice message="Preview: Google sign-in will work once Firebase is connected." />
          </View>
        ) : null}

        <View style={styles.spacer} />

        <Text style={styles.terms}>
          By continuing, you agree to our <Text style={styles.link}>Terms of Service</Text> and{' '}
          <Text style={styles.link}>Privacy Policy</Text>.
        </Text>
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
  subtitle: {
    ...typography.body,
    lineHeight: 22,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  field: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  or: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginVertical: spacing.lg,
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
  notice: {
    marginTop: spacing.md,
  },
  spacer: {
    flex: 1,
    minHeight: spacing.xl,
  },
  terms: {
    ...typography.caption,
    lineHeight: 18,
    color: colors.textSubtle,
    textAlign: 'center',
  },
  link: {
    color: colors.primary,
    fontWeight: '600',
  },
});
