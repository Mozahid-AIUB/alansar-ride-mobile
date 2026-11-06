import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { authApi, describeError } from '@alansar/api';
import { googleReady, signIn } from '@alansar/auth';
import { useT } from '@alansar/i18n';
import { fonts, gradients, lightTheme, onHero } from '@alansar/theme';
import { isValidLoginId } from '@alansar/utils';

import { GoogleLogo } from '@/components/GoogleLogo';
import { PressableScale } from '@/components/PressableScale';

const { colors, spacing, radius, typography, controls } = lightTheme;

/**
 * Driver sign-in. Uses the same /auth/login as the rider app, but only lets a
 * driver account through — a customer is told to use the rider app.
 */
export function DriverLoginScreen() {
  const insets = useSafeAreaInsets();
  const t = useT();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleTapped, setGoogleTapped] = useState(false);

  const canSubmit = isValidLoginId(loginId.trim()) && password.length > 0;

  const onSubmit = async () => {
    if (!canSubmit || busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await authApi.login(loginId.trim(), password);
      if (result.user.user_type !== 'driver') {
        setError(t('driverLogin.customerAccount'));
        return;
      }
      await signIn(result);
    } catch (err) {
      setError(describeError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <LinearGradient {...gradients.header} style={[styles.hero, { paddingTop: insets.top + spacing.xl }]}>
        <Text style={styles.brand}>Al Ansar Driver</Text>
        <Text style={styles.tagline}>{t('driverLogin.tagline')}</Text>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.title}>{t('driverLogin.title')}</Text>

        <View style={styles.fields}>
          <TextInput
            value={loginId}
            onChangeText={setLoginId}
            placeholder={t('driverLogin.loginId')}
            placeholderTextColor={colors.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder={t('driverLogin.password')}
            placeholderTextColor={colors.placeholder}
            secureTextEntry
            style={styles.input}
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PressableScale
          accessibilityRole="button"
          style={[styles.button, !canSubmit && styles.buttonDisabled]}
          disabled={!canSubmit || busy}
          onPress={() => void onSubmit()}
        >
          {busy ? (
            <ActivityIndicator color={colors.onPrimary} />
          ) : (
            <Text style={styles.buttonText}>{t('driverLogin.submit')}</Text>
          )}
        </PressableScale>

        <View style={styles.divider}>
          <View style={styles.rule} />
          <Text style={styles.dividerText}>{t('driverLogin.or')}</Text>
          <View style={styles.rule} />
        </View>

        <PressableScale
          accessibilityRole="button"
          style={styles.googleButton}
          onPress={() => setGoogleTapped(true)}
        >
          <GoogleLogo size={20} />
          <Text style={styles.googleText}>{t('driverLogin.google')}</Text>
        </PressableScale>
        {googleTapped && !googleReady ? (
          <Text style={styles.note}>{t('driverLogin.googleNotReady')}</Text>
        ) : null}

        <Text style={styles.note}>{t('driverLogin.note')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl + spacing.xl,
    alignItems: 'center',
  },
  brand: {
    ...typography.display,
    color: onHero.text,
  },
  tagline: {
    ...typography.body,
    color: onHero.textMuted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  card: {
    marginTop: -spacing.xl,
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    gap: spacing.md,
  },
  title: {
    ...typography.headline,
    color: colors.text,
  },
  fields: {
    gap: spacing.sm + 4,
  },
  input: {
    height: controls.inputHeight,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: controls.borderWidth,
    borderColor: colors.border,
    backgroundColor: colors.inputFill,
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.text,
  },
  error: {
    ...typography.bodySmall,
    color: colors.danger,
  },
  button: {
    height: controls.inputHeight,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    ...typography.bodyStrong,
    color: colors.onPrimary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  rule: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.bodySmall,
    color: colors.textSubtle,
  },
  googleButton: {
    height: controls.inputHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm + 2,
    borderRadius: radius.md,
    borderWidth: controls.borderWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  googleText: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  note: {
    ...typography.caption,
    color: colors.textSubtle,
    textAlign: 'center',
  },
});
