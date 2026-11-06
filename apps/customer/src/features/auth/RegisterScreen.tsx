import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { EnvelopeSimple, User } from 'phosphor-react-native';

import { authApi, describeError } from '@alansar/api';
import { googleReady, signIn } from '@alansar/auth';
import { useT } from '@alansar/i18n';
import { lightTheme } from '@alansar/theme';
import { isValidBdMobile, isValidEmail, PASSWORD_MIN, toE164Bd } from '@alansar/utils';

import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { Notice } from '@/components/Notice';
import { PasswordField } from '@/components/PasswordField';
import { TextField } from '@/components/TextField';

import { AuthLayout } from './AuthLayout';
import { GoogleButton, LegalLinks, OrDivider, SwitchPrompt } from './AuthParts';
import { PhoneField } from './PhoneField';

const { spacing } = lightTheme;

/**
 * Sign-up step 1. The API only holds these details (pending_registrations) and
 * emails a code; the account is created when that code is verified.
 */
export function RegisterScreen() {
  const t = useT();
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
    <AuthLayout title={t('register.title')} subtitle={t('register.subtitle')}>
      <View style={styles.form}>
        <View style={styles.fields}>
          <TextField
            label={t('register.fullName')}
            icon={User}
            value={name}
            onChangeText={setName}
            autoComplete="name"
            textContentType="name"
            autoCapitalize="words"
            returnKeyType="next"
          />
          <PhoneField
            label={t('register.mobile')}
            value={phone}
            onChange={setPhone}
            error={phone.length === 10 && !phoneValid ? t('auth.invalidPhone') : undefined}
          />
          <TextField
            label={t('register.email')}
            icon={EnvelopeSimple}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
            autoCapitalize="none"
            autoCorrect={false}
            error={email.trim() !== '' && !emailValid ? t('auth.invalidEmail') : undefined}
          />
          <PasswordField
            label={t('register.password', { min: PASSWORD_MIN })}
            value={password}
            onChangeText={setPassword}
            autoComplete="new-password"
            textContentType="newPassword"
          />
          <PasswordField
            label={t('register.confirmPassword')}
            value={confirm}
            onChangeText={setConfirm}
            autoComplete="new-password"
            textContentType="newPassword"
            error={mismatch ? t('auth.passwordMismatch') : undefined}
          />
        </View>

        <Checkbox checked={agreed} onChange={setAgreed}>
          {t('auth.agreeTo')}<LegalLinks short />
        </Checkbox>

        {error ? <Notice tone="error" message={error} /> : null}

        <Button
          label={t('register.submit')}
          disabled={!canSubmit}
          loading={busy}
          onPress={() => void onSubmit()}
        />

        <OrDivider label={t('auth.or')} />
        <GoogleButton label={t('auth.signupGoogle')} onPress={() => setGoogleTapped(true)} />
        {googleTapped && !googleReady ? (
          <Notice message={t('auth.googleNotReady')} />
        ) : null}

        <SwitchPrompt
          question={t('register.haveAccount')}
          action={t('register.login')}
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
