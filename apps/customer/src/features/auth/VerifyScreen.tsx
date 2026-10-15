import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { authReady } from '@alansar/auth';
import { lightTheme } from '@alansar/theme';

import { Button } from '@/components/Button';

import { AuthLayout } from './AuthLayout';
import { HeroStrong, ResendCode, TextLink } from './AuthParts';
import { CodeInput } from './CodeInput';
import { PreviewNotice } from './PreviewNotice';

const { spacing } = lightTheme;

const CODE_LENGTH = 6;

/** Sign-up step 2: the emailed code. The account is created only when this succeeds. */
export function VerifyScreen() {
  const { email = '' } = useLocalSearchParams<{ email?: string; phone?: string }>();
  const [code, setCode] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={
        <>
          Enter the 6-digit code sent to <HeroStrong>{email}</HeroStrong>
        </>
      }
    >
      <CodeInput value={code} onChange={setCode} length={CODE_LENGTH} />

      <View style={styles.row}>
        <ResendCode />
        <TextLink label="Change email" onPress={() => router.back()} />
      </View>

      {!authReady ? (
        <PreviewNotice
          message={
            submitted
              ? 'Preview: in the live app this creates your account and logs you in.'
              : 'Preview: no email was sent. Real codes are checked once the app is connected to the server.'
          }
        />
      ) : null}

      <View style={styles.spacer} />

      <Button
        label="Verify and create account"
        disabled={code.length < CODE_LENGTH}
        onPress={() => setSubmitted(true)}
      />
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
  spacer: {
    flex: 1,
    minHeight: spacing.xl,
  },
});
