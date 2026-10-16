import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { authApi, describeError } from '@alansar/api';
import { signIn } from '@alansar/auth';
import { lightTheme } from '@alansar/theme';

import { Button } from '@/components/Button';
import { Notice } from '@/components/Notice';

import { AuthLayout } from './AuthLayout';
import { HeroStrong, ResendCode, TextLink } from './AuthParts';
import { CodeInput } from './CodeInput';

const { spacing } = lightTheme;

const CODE_LENGTH = 6;

type Message = { tone: 'error' | 'success'; text: string } | null;

/** Sign-up step 2: the emailed code. The account is created only when this succeeds. */
export function VerifyScreen() {
  const { email = '', sent } = useLocalSearchParams<{ email?: string; sent?: string }>();
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<Message>(
    sent === '0'
      ? { tone: 'error', text: "We couldn't send the email. Check the address, or tap Resend code." }
      : null,
  );

  const onVerify = async () => {
    if (code.length < CODE_LENGTH || busy) return;
    setBusy(true);
    setMessage(null);
    try {
      // The root layout's guard sends a signed-in user to Home.
      await signIn(await authApi.verifyRegistration(email, code));
    } catch (err) {
      setMessage({ tone: 'error', text: describeError(err) });
    } finally {
      setBusy(false);
    }
  };

  const onResend = async () => {
    setMessage(null);
    try {
      const result = await authApi.resendRegistrationCode(email);
      setMessage(
        result.sent
          ? { tone: 'success', text: `A new code is on its way to ${email}.` }
          : { tone: 'error', text: "We couldn't send the email. Please try again in a minute." },
      );
    } catch (err) {
      setMessage({ tone: 'error', text: describeError(err) });
    }
  };

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
        <ResendCode seconds={60} onResend={() => void onResend()} />
        <TextLink label="Change email" onPress={() => router.back()} />
      </View>

      {message ? <Notice tone={message.tone} message={message.text} /> : null}

      <View style={styles.spacer} />

      <Button
        label="Verify and create account"
        disabled={code.length < CODE_LENGTH}
        loading={busy}
        onPress={() => void onVerify()}
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
  spacer: {
    flex: 1,
    minHeight: spacing.xl,
  },
});
