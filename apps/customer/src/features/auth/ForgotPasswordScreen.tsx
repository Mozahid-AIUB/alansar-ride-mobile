import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { EnvelopeSimple } from 'phosphor-react-native';

import { authApi, describeError } from '@alansar/api';
import { useT } from '@alansar/i18n';
import { lightTheme } from '@alansar/theme';
import { isValidEmail } from '@alansar/utils';

import { Button } from '@/components/Button';
import { Notice } from '@/components/Notice';
import { TextField } from '@/components/TextField';

import { AuthLayout } from './AuthLayout';
import { backToLogin, SwitchPrompt } from './AuthParts';

const { spacing } = lightTheme;

/** Forgot password, step 1. The API answers the same whether or not the email has an account. */
export function ForgotPasswordScreen() {
  const t = useT();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const valid = isValidEmail(email);

  const onSubmit = async () => {
    if (!valid || busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await authApi.forgotPassword(email.trim());
      router.push({ pathname: '/reset-password', params: { email: result.email } });
    } catch (err) {
      setError(describeError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title={t('forgot.title')} subtitle={t('forgot.subtitle')}>
      <View style={styles.form}>
        <TextField
          label={t('forgot.email')}
          icon={EnvelopeSimple}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
          returnKeyType="send"
          onSubmitEditing={() => void onSubmit()}
          error={email.trim() !== '' && !valid ? t('auth.invalidEmail') : undefined}
        />
        {error ? <Notice tone="error" message={error} /> : null}
        <Button label={t('forgot.submit')} disabled={!valid} loading={busy} onPress={() => void onSubmit()} />
        <SwitchPrompt question={t('forgot.remembered')} action={t('forgot.login')} onPress={backToLogin} />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.md,
  },
});
