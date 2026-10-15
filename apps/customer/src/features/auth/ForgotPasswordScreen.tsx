import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { EnvelopeSimple } from 'phosphor-react-native';

import { lightTheme } from '@alansar/theme';
import { isValidEmail } from '@alansar/utils';

import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';

import { AuthLayout } from './AuthLayout';
import { backToLogin, INVALID_EMAIL, SwitchPrompt } from './AuthParts';

const { spacing } = lightTheme;

/** Forgot password, step 1. The API answers the same whether or not the email has an account. */
export function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const valid = isValidEmail(email);

  const onSubmit = () => {
    if (valid) router.push({ pathname: '/reset-password', params: { email: email.trim() } });
  };

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter your account's email and we'll send you a code to reset it."
    >
      <View style={styles.form}>
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
          autoCorrect={false}
          autoFocus
          returnKeyType="send"
          onSubmitEditing={onSubmit}
          error={email.trim() !== '' && !valid ? INVALID_EMAIL : undefined}
        />
        <Button label="Send code" disabled={!valid} onPress={onSubmit} />
        <SwitchPrompt question="Remembered it?" action="Log in" onPress={backToLogin} />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.lg,
  },
});
