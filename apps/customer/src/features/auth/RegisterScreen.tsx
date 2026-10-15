import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { EnvelopeSimple, User } from 'phosphor-react-native';

import { authReady } from '@alansar/auth';
import { lightTheme } from '@alansar/theme';
import { isValidBdMobile, isValidEmail, PASSWORD_MIN, toE164Bd } from '@alansar/utils';

import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
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
import { PreviewNotice } from './PreviewNotice';

const { spacing } = lightTheme;

/**
 * Nothing here creates an account: the API holds the details and emails a
 * code, and the account only exists once that code is verified on the next screen.
 */
export function RegisterScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [googleTapped, setGoogleTapped] = useState(false);

  const phoneValid = isValidBdMobile(phone);
  const emailValid = isValidEmail(email);
  const canSubmit =
    name.trim().length >= 2 && phoneValid && emailValid && password.length >= PASSWORD_MIN && agreed;

  const onSubmit = () => {
    if (!canSubmit) return;
    router.push({ pathname: '/verify', params: { email: email.trim(), phone: toE164Bd(phone) } });
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
        </View>

        <Checkbox checked={agreed} onChange={setAgreed}>
          I agree to the <LegalLinks />
        </Checkbox>

        <Button label="Create account" disabled={!canSubmit} onPress={onSubmit} />

        <OrDivider label="or" />
        <GoogleButton label="Sign up with Google" onPress={() => setGoogleTapped(true)} />
        {googleTapped && !authReady ? (
          <PreviewNotice message="Preview: Google sign-up needs Firebase, which isn't set up yet." />
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
    gap: spacing.md,
  },
  fields: {
    gap: spacing.sm + 4,
  },
});
