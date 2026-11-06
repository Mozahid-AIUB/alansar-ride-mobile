import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { authApi, describeError } from '@alansar/api';
import { useT } from '@alansar/i18n';
import { lightTheme } from '@alansar/theme';
import { PASSWORD_MIN } from '@alansar/utils';

import { Button } from '@/components/Button';
import { Notice } from '@/components/Notice';
import { PasswordField } from '@/components/PasswordField';

import { AuthLayout } from './AuthLayout';
import { HeroStrong, ResendCode, TextLink } from './AuthParts';
import { CodeInput } from './CodeInput';

const { spacing } = lightTheme;

const CODE_LENGTH = 6;

type Message = { tone: 'error' | 'success'; text: string } | null;

/** Forgot password, step 2: the emailed code and the new password, sent together. */
export function ResetPasswordScreen() {
  const t = useT();
  const { email = '' } = useLocalSearchParams<{ email?: string }>();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<Message>(null);

  const mismatch = confirm !== '' && confirm !== password;
  const canSubmit =
    code.length === CODE_LENGTH && password.length >= PASSWORD_MIN && confirm === password;

  const onReset = async () => {
    if (!canSubmit || busy) return;
    setBusy(true);
    setMessage(null);
    try {
      await authApi.resetPassword(email, code, password);
      router.replace({ pathname: '/login', params: { notice: 'password-reset' } });
    } catch (err) {
      setMessage({ tone: 'error', text: describeError(err) });
    } finally {
      setBusy(false);
    }
  };

  const onResend = async () => {
    setMessage(null);
    try {
      await authApi.forgotPassword(email);
      setMessage({ tone: 'success', text: t('reset.newCodeSent', { email }) });
    } catch (err) {
      setMessage({ tone: 'error', text: describeError(err) });
    }
  };

  return (
    <AuthLayout
      title={t('reset.title')}
      subtitle={
        <>
          {t('reset.subtitlePre')}<HeroStrong>{email}</HeroStrong>{t('reset.subtitlePost')}
        </>
      }
    >
      <CodeInput value={code} onChange={setCode} length={CODE_LENGTH} />

      <View style={styles.row}>
        <ResendCode seconds={60} onResend={() => void onResend()} />
        <TextLink label={t('reset.changeEmail')} onPress={() => router.back()} />
      </View>

      <View style={styles.fields}>
        <PasswordField
          label={t('reset.newPassword', { min: PASSWORD_MIN })}
          value={password}
          onChangeText={setPassword}
          autoComplete="new-password"
          textContentType="newPassword"
        />
        <PasswordField
          label={t('reset.confirmPassword')}
          value={confirm}
          onChangeText={setConfirm}
          autoComplete="new-password"
          textContentType="newPassword"
          error={mismatch ? t('auth.passwordMismatch') : undefined}
        />
      </View>

      {message ? (
        <View style={styles.notice}>
          <Notice tone={message.tone} message={message.text} />
        </View>
      ) : null}

      <View style={styles.spacer} />

      <Button
        label={t('reset.submit')}
        disabled={!canSubmit}
        loading={busy}
        onPress={() => void onReset()}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  fields: {
    gap: spacing.sm + 4,
  },
  notice: {
    marginTop: spacing.md,
  },
  spacer: {
    flex: 1,
    minHeight: spacing.xl,
  },
});
