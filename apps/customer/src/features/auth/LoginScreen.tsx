import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowRight, User } from 'phosphor-react-native';

import { authApi, describeError } from '@alansar/api';
import { googleReady, signIn } from '@alansar/auth';
import { useT } from '@alansar/i18n';
import { lightTheme } from '@alansar/theme';
import { isValidLoginId } from '@alansar/utils';

import { Button } from '@/components/Button';
import { Notice } from '@/components/Notice';
import { PasswordField } from '@/components/PasswordField';
import { TextField } from '@/components/TextField';

import { AuthLayout } from './AuthLayout';
import { GoogleButton, LegalTerms, OrDivider, SwitchPrompt, TextLink } from './AuthParts';

const { colors, spacing, typography } = lightTheme;

export function LoginScreen() {
  const t = useT();
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
        setError(t('auth.driverAccount'));
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
    <AuthLayout title={t('login.title')} subtitle={t('login.subtitle')}>
      <View style={styles.form}>
        {notice === 'password-reset' && !error ? (
          <Notice tone="success" message={t('login.passwordReset')} />
        ) : null}

        <View style={styles.fields}>
          <TextField
            label={t('login.loginId')}
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
            label={t('login.password')}
            value={password}
            onChangeText={setPassword}
            autoComplete="current-password"
            textContentType="password"
            returnKeyType="done"
            onSubmitEditing={() => void onSubmit()}
          />
          <View style={styles.forgot}>
            <TextLink label={t('login.forgot')} onPress={() => router.push('/forgot-password')} />
          </View>
        </View>

        {error ? <Notice tone="error" message={error} /> : null}

        <Button
          label={t('login.submit')}
          disabled={!canSubmit}
          loading={busy}
          onPress={() => void onSubmit()}
          trailing={<ArrowRight size={20} color={colors.onPrimary} weight="bold" />}
        />

        <OrDivider label={t('auth.or')} />
        <GoogleButton label={t('auth.continueGoogle')} onPress={() => setGoogleTapped(true)} />
        {googleTapped && !googleReady ? (
          <Notice message={t('auth.googleNotReady')} />
        ) : null}

        <SwitchPrompt
          question={t('login.noAccount')}
          action={t('login.signup')}
          onPress={() => router.replace('/register')}
        />
      </View>

      <View style={styles.spacer} />

      <Text style={styles.terms}>
        <LegalTerms />
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
