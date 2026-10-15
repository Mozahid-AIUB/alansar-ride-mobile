import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { authReady } from '@alansar/auth';
import { lightTheme } from '@alansar/theme';
import { PASSWORD_MIN } from '@alansar/utils';

import { Button } from '@/components/Button';
import { PasswordField } from '@/components/PasswordField';

import { AuthLayout } from './AuthLayout';
import { HeroStrong, ResendCode, TextLink } from './AuthParts';
import { CodeInput } from './CodeInput';
import { PreviewNotice } from './PreviewNotice';

const { spacing } = lightTheme;

const CODE_LENGTH = 6;

/** Forgot password, step 2: the emailed code and the new password, sent together. */
export function ResetPasswordScreen() {
  const { email = '' } = useLocalSearchParams<{ email?: string }>();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const mismatch = confirm !== '' && confirm !== password;
  const canSubmit =
    code.length === CODE_LENGTH && password.length >= PASSWORD_MIN && confirm === password;

  return (
    <AuthLayout
      title="Reset password"
      subtitle={
        <>
          Enter the code sent to <HeroStrong>{email}</HeroStrong> and choose a new password.
        </>
      }
    >
      <CodeInput value={code} onChange={setCode} length={CODE_LENGTH} />

      <View style={styles.row}>
        <ResendCode />
        <TextLink label="Change email" onPress={() => router.back()} />
      </View>

      <View style={styles.fields}>
        <PasswordField
          label="New password"
          value={password}
          onChangeText={setPassword}
          placeholder="Create a new password"
          autoComplete="new-password"
          textContentType="newPassword"
          hint={`At least ${PASSWORD_MIN} characters.`}
        />
        <PasswordField
          label="Confirm new password"
          value={confirm}
          onChangeText={setConfirm}
          placeholder="Type it again"
          autoComplete="new-password"
          textContentType="newPassword"
          error={mismatch ? "Passwords don't match" : undefined}
        />
      </View>

      {!authReady ? (
        <View style={styles.notice}>
          <PreviewNotice
            message={
              submitted
                ? 'Preview: in the live app this saves your new password and takes you to Log in.'
                : 'Preview: no email was sent. Real codes are checked once the app is connected to the server.'
            }
          />
        </View>
      ) : null}

      <View style={styles.spacer} />

      <Button label="Reset password" disabled={!canSubmit} onPress={() => setSubmitted(true)} />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  fields: {
    gap: spacing.md + 4,
  },
  notice: {
    marginTop: spacing.lg,
  },
  spacer: {
    flex: 1,
    minHeight: spacing.xl,
  },
});
