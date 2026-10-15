import { Pressable, StyleSheet, Text, View } from 'react-native';

import { lightTheme } from '@alansar/theme';

import { Button } from '@/components/Button';
import { GoogleLogo } from '@/components/GoogleLogo';

const { colors, spacing, typography } = lightTheme;

export const INVALID_PHONE = 'Enter a valid Bangladeshi mobile number';

export function OrDivider({ label }: { label: string }) {
  return (
    <View style={styles.or}>
      <View style={styles.rule} />
      <Text style={styles.orText}>{label}</Text>
      <View style={styles.rule} />
    </View>
  );
}

export function GoogleButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Button variant="outline" label={label} leading={<GoogleLogo size={20} />} onPress={onPress} />
  );
}

/** "Don't have an account? Sign up" */
export function SwitchPrompt({
  question,
  action,
  onPress,
}: {
  question: string;
  action: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.switchRow}>
      <Text style={styles.switchText}>{question}</Text>
      <Pressable accessibilityRole="button" hitSlop={8} onPress={onPress}>
        <Text style={styles.link}>{action}</Text>
      </Pressable>
    </View>
  );
}

export function LegalLinks() {
  return (
    <>
      <Text style={styles.inlineLink}>Terms of Service</Text> and{' '}
      <Text style={styles.inlineLink}>Privacy Policy</Text>
    </>
  );
}

const styles = StyleSheet.create({
  or: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  rule: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  orText: {
    ...typography.bodySmall,
    color: colors.textSubtle,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  switchText: {
    ...typography.body,
    color: colors.textMuted,
  },
  link: {
    ...typography.titleSmall,
    color: colors.primary,
  },
  inlineLink: {
    color: colors.primary,
    fontWeight: '600',
  },
});
