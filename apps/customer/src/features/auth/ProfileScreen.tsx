import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { authReady } from '@alansar/auth';
import { lightTheme } from '@alansar/theme';
import { isValidEmail } from '@alansar/utils';

import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';

import { PreviewNotice } from './PreviewNotice';

const { colors, spacing, typography } = lightTheme;

const enter = (delay: number) => FadeInDown.delay(delay).duration(480);

/** Sign-up step for a new number: the code is already verified, we only need a name. */
export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const nameValid = name.trim().length >= 2;
  const emailValid = email.trim() === '' || isValidEmail(email);
  const emailError = email.trim() !== '' && !emailValid ? 'Enter a valid email address' : undefined;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.lg },
        ]}
      >
        <BackButton />

        <Animated.Text entering={enter(0)} style={styles.title}>
          What's your name?
        </Animated.Text>
        <Animated.Text entering={enter(60)} style={styles.subtitle}>
          Your driver will see this when they pick you up.
        </Animated.Text>

        <Animated.View entering={enter(120)} style={styles.fields}>
          <TextField
            label="Full name"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Rahim Uddin"
            autoComplete="name"
            textContentType="name"
            autoCapitalize="words"
            autoFocus
            returnKeyType="next"
          />
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
            autoCapitalize="none"
            error={emailError}
            hint="For ride receipts."
          />
        </Animated.View>

        {submitted && !authReady ? (
          <PreviewNotice message="Preview: the account is created once Firebase is connected." />
        ) : null}

        <View style={styles.spacer} />

        <Animated.View entering={enter(200)}>
          <Button
            label="Create account"
            disabled={!nameValid || !emailValid}
            onPress={() => setSubmitted(true)}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.headlineLarge,
    color: colors.text,
    marginTop: spacing.lg,
  },
  subtitle: {
    ...typography.body,
    lineHeight: 22,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  fields: {
    gap: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  spacer: {
    flex: 1,
    minHeight: spacing.xl,
  },
});
