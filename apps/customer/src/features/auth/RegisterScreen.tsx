import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { EnvelopeSimple, User } from 'phosphor-react-native';

import { authApi, describeError } from '@alansar/api';
import { googleReady, signIn } from '@alansar/auth';
import { lightTheme } from '@alansar/theme';
import { isValidBdMobile, isValidEmail, PASSWORD_MIN, toE164Bd } from '@alansar/utils';

import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { Notice } from '@/components/Notice';
import { PasswordField } from '@/components/PasswordField';
import { TextField } from '@/components/TextField';

import { AuthLayout } from './AuthLayout';
import {
  GoogleButton,
  INVALID_EMAIL,
  INVALID_PHONE,
  LegalLinks,
  OrDivider,
  SwitchPrompt,
} from './AuthParts';
import { PhoneField } from './PhoneField';

const { spacing } = lightTheme;

/**
 * Sign-up step 1. The API only holds these details (pending_registrations) and
 * emails a code; the account is created when that code is verified.
 */
export function RegisterScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleTapped, setGoogleTapped] = useState(false);

  const phoneValid = isValidBdMobile(phone);
  const emailValid = isValidEmail(email);
  const mismatch = confirm !== '' && confirm !== password;
  const canSubmit =
    name.trim().length >= 2 &&
    phoneValid &&
    emailValid &&
    password.length >= PASSWORD_MIN &&
    confirm === password &&
    agreed;

  const onSubmit = async () => {
    if (!canSubmit || busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await authApi.register({
        fullName: name.trim(),
        email: email.trim(),
        phone: toE164Bd(phone),
        password,
        role: 'customer',
      });
      if (!result.otpRequired) {
        // The operator has switched codes off: the account already exists.
        await signIn(result);
        return;
      }
      router.push({
        pathname: '/verify',
        params: { email: result.email, sent: result.sent ? '1' : '0' },
      });
    } catch (err) {
      setError(describeError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Join Al Ansar Ride in under a minute.">
      <View style={styles.form}>
        <View style={styles.fields}>
          <TextField
            label="Full name"
            icon={User}
            value={name}
            onChangeText={setName}
            autoComplete="name"
            textContentType="name"
            autoCapitalize="words"
            returnKeyType="next"
          />
          <PhoneField
            label="Mobile number"
            value={phone}
            onChange={setPhone}
            error={phone.length === 10 && !phoneValid ? INVALID_PHONE : undefined}
          />
          <TextField
            label="Email address"
            icon={EnvelopeSimple}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
            autoCapitalize="none"
            autoCorrect={false}
            error={email.trim() !== '' && !emailValid ? INVALID_EMAIL : undefined}
          />
          <PasswordField
            label={`Password (min. ${PASSWORD_MIN} characters)`}
            value={password}
            onChangeText={setPassword}
            autoComplete="new-password"
            textContentType="newPassword"
          />
          <PasswordField
            label="Confirm password"
            value={confirm}
            onChangeText={setConfirm}
            autoComplete="new-password"
            textContentType="newPassword"
            error={mismatch ? "Passwords don't match" : undefined}
          />
        </View>

        <Checkbox checked={agreed} onChange={setAgreed}>
          I agree to the <LegalLinks short />
        </Checkbox>

        {error ? <Notice tone="error" message={error} /> : null}

        <Button
          label="Create account"
          disabled={!canSubmit}
          loading={busy}
          onPress={() => void onSubmit()}
        />

        <OrDivider label="or" />
        <GoogleButton label="Sign up with Google" onPress={() => setGoogleTapped(true)} />
        {googleTapped && !googleReady ? (
          <Notice message="Google sign-up needs Firebase, which isn't set up on the server yet." />
        ) : null}

        <SwitchPrompt
          question="Already have an account?"
          action="Log in"
          onPress={() => router.replace('/login')}
        />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.sm + 6,
  },
  fields: {
    gap: spacing.sm + 2,
  },
});
