import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowRight, User } from 'phosphor-react-native';

import { authApi, describeError } from '@alansar/api';
import { googleReady, signIn } from '@alansar/auth';
import { lightTheme } from '@alansar/theme';
import { isValidLoginId } from '@alansar/utils';

import { Button } from '@/components/Button';
import { Notice } from '@/components/Notice';
import { PasswordField } from '@/components/PasswordField';
import { TextField } from '@/components/TextField';

import { AuthLayout } from './AuthLayout';
import { GoogleButton, LegalLinks, OrDivider, SwitchPrompt, TextLink } from './AuthParts';

const { colors, spacing, typography } = lightTheme;

const DRIVER_ACCOUNT = 'This is a driver account. Please log in with the Al Ansar Driver app.';

export function LoginScreen() {
  const { notice } = useLocalSearchParams<{ notice?: string }>();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleTapped, setGoogleTapped] = useState(false);

  const canSubmit = isValidLoginId(loginId.trim()) && password.length > 0;

  const onSubmit = async () => {
    if (!canSubmit || busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await authApi.login(loginId.trim(), password);
      if (result.user.user_type !== 'customer') {
        setError(DRIVER_ACCOUNT);
        return;
      }
      // The root layout's guard sends a signed-in user to Home.
      await signIn(result);
    } catch (err) {
      setError(describeError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to book your next ride.">
      <View style={styles.form}>
        {notice === 'password-reset' && !error ? (
          <Notice tone="success" message="Password updated. Log in with your new password." />
        ) : null}

        <View style={styles.fields}>
          <TextField
            label="Phone or email"
            icon={User}
            value={loginId}
            onChangeText={setLoginId}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="username"
            textContentType="username"
            returnKeyType="next"
          />
          <PasswordField
            label="Password"
            value={password}
            onChangeText={setPassword}
            autoComplete="current-password"
            textContentType="password"
            returnKeyType="done"
            onSubmitEditing={() => void onSubmit()}
          />
          <View style={styles.forgot}>
            <TextLink label="Forgot password?" onPress={() => router.push('/forgot-password')} />
          </View>
        </View>

        {error ? <Notice tone="error" message={error} /> : null}

        <Button
          label="Log in"
          disabled={!canSubmit}
          loading={busy}
          onPress={() => void onSubmit()}
          trailing={<ArrowRight size={20} color={colors.onPrimary} weight="bold" />}
        />

        <OrDivider label="or" />
        <GoogleButton label="Continue with Google" onPress={() => setGoogleTapped(true)} />
        {googleTapped && !googleReady ? (
          <Notice message="Google sign-in needs Firebase, which isn't set up on the server yet." />
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
    gap: spacing.md,
  },
  fields: {
    gap: spacing.sm + 4,
  },
  forgot: {
    alignItems: 'flex-end',
  },
  spacer: {
    flex: 1,
    minHeight: spacing.lg,
  },
  terms: {
    ...typography.caption,
    lineHeight: 18,
    color: colors.textSubtle,
    textAlign: 'center',
  },
});
