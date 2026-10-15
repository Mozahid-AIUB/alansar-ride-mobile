import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ArrowRight, User } from 'phosphor-react-native';

import { authReady } from '@alansar/auth';
import { lightTheme } from '@alansar/theme';
import { isValidLoginId } from '@alansar/utils';

import { Button } from '@/components/Button';
import { PasswordField } from '@/components/PasswordField';
import { TextField } from '@/components/TextField';

import { AuthLayout } from './AuthLayout';
import { GoogleButton, LegalLinks, OrDivider, SwitchPrompt, TextLink } from './AuthParts';
import { PreviewNotice } from './PreviewNotice';

const { colors, spacing, typography } = lightTheme;

export function LoginScreen() {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [tapped, setTapped] = useState<'login' | 'google' | null>(null);

  const canSubmit = isValidLoginId(loginId.trim()) && password.length > 0;
  const onSubmit = () => {
    if (canSubmit) setTapped('login');
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to book your next ride.">
      <View style={styles.form}>
        <View style={styles.fields}>
          <TextField
            label="Phone or email"
            icon={User}
            value={loginId}
            onChangeText={setLoginId}
            placeholder="01712-345678 or you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="username"
            textContentType="username"
            returnKeyType="next"
          />
          <View>
            <PasswordField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Your password"
              autoComplete="current-password"
              textContentType="password"
              returnKeyType="done"
              onSubmitEditing={onSubmit}
            />
            <View style={styles.forgot}>
              <TextLink label="Forgot password?" onPress={() => router.push('/forgot-password')} />
            </View>
          </View>
        </View>

        <Button
          label="Log in"
          disabled={!canSubmit}
          onPress={onSubmit}
          trailing={<ArrowRight size={20} color={colors.onPrimary} weight="bold" />}
        />
        {tapped === 'login' && !authReady ? (
          <PreviewNotice message="Preview: the app isn't connected to the server yet, so nothing was checked." />
        ) : null}

        <OrDivider label="or continue with" />
        <GoogleButton label="Continue with Google" onPress={() => setTapped('google')} />
        {tapped === 'google' && !authReady ? (
          <PreviewNotice message="Preview: Google sign-in needs Firebase, which isn't set up yet." />
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
  fields: {
    gap: spacing.md + 4,
  },
  forgot: {
    alignItems: 'flex-end',
    marginTop: spacing.sm + 4,
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
