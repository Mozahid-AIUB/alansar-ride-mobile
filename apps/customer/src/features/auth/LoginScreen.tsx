import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ArrowRight } from 'phosphor-react-native';

import { authReady } from '@alansar/auth';
import { lightTheme } from '@alansar/theme';
import { isValidBdMobile, toE164Bd } from '@alansar/utils';

import { Button } from '@/components/Button';

import { AuthLayout } from './AuthLayout';
import { GoogleButton, INVALID_PHONE, LegalLinks, OrDivider, SwitchPrompt } from './AuthParts';
import { PhoneField } from './PhoneField';
import { PreviewNotice } from './PreviewNotice';

const { colors, spacing, typography } = lightTheme;

export function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [googleTapped, setGoogleTapped] = useState(false);

  const valid = isValidBdMobile(phone);
  const error = phone.length === 10 && !valid ? INVALID_PHONE : undefined;

  const onContinue = () => {
    if (!valid) return;
    router.push({ pathname: '/verify', params: { mode: 'login', phone: toE164Bd(phone) } });
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to book your next ride.">
      <View style={styles.form}>
        <PhoneField
          label="Mobile number"
          value={phone}
          onChange={setPhone}
          error={error}
          onSubmit={onContinue}
        />

        <Button
          label="Log in"
          disabled={!valid}
          onPress={onContinue}
          trailing={<ArrowRight size={20} color={colors.onPrimary} weight="bold" />}
        />

        <OrDivider label="or continue with" />
        <GoogleButton label="Continue with Google" onPress={() => setGoogleTapped(true)} />

        {googleTapped && !authReady ? (
          <PreviewNotice message="Preview: Google sign-in will work once Firebase is connected." />
        ) : null}

        <SwitchPrompt
          question="Don't have an account?"
          action="Sign up"
          onPress={() => router.replace('/register')}
        />
      </View>

      <View style={styles.spacer} />

      <Text style={styles.terms}>
        By continuing, you agree to our <LegalLinks />.
      </Text>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.lg,
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
});
