import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { EnvelopeSimple, User } from 'phosphor-react-native';

import { authReady } from '@alansar/auth';
import { lightTheme } from '@alansar/theme';
import { isValidBdMobile, isValidEmail, toE164Bd } from '@alansar/utils';

import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { TextField } from '@/components/TextField';

import { AuthLayout } from './AuthLayout';
import { GoogleButton, INVALID_PHONE, LegalLinks, OrDivider, SwitchPrompt } from './AuthParts';
import { PhoneField } from './PhoneField';
import { PreviewNotice } from './PreviewNotice';

const { spacing } = lightTheme;

/**
 * Nothing is sent to the API here. The details travel to the code screen, and
 * the account is only created once the SMS code is verified.
 */
export function RegisterScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [googleTapped, setGoogleTapped] = useState(false);

  const phoneValid = isValidBdMobile(phone);
  const emailValid = email.trim() === '' || isValidEmail(email);
  const canSubmit = name.trim().length >= 2 && phoneValid && emailValid && agreed;

  const onSubmit = () => {
    if (!canSubmit) return;
    router.push({
      pathname: '/verify',
      params: { mode: 'register', phone: toE164Bd(phone), name: name.trim(), email: email.trim() },
    });
  };

  return (
    <AuthLayout title="Create your account" subtitle="Sign up in a minute. No password needed.">
      <View style={styles.form}>
        <View style={styles.fields}>
          <TextField
            label="Full name"
            icon={User}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Rahim Uddin"
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
            label="Email"
            icon={EnvelopeSimple}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
            autoCapitalize="none"
            error={emailValid ? undefined : 'Enter a valid email address'}
            hint="For ride receipts."
          />
        </View>

        <Checkbox checked={agreed} onChange={setAgreed}>
          I agree to the <LegalLinks />
        </Checkbox>

        <Button label="Create account" disabled={!canSubmit} onPress={onSubmit} />

        <OrDivider label="or sign up with" />
        <GoogleButton label="Sign up with Google" onPress={() => setGoogleTapped(true)} />

        {googleTapped && !authReady ? (
          <PreviewNotice message="Preview: Google sign-up will work once Firebase is connected." />
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
    gap: spacing.lg,
  },
  fields: {
    gap: spacing.md + 4,
  },
});
