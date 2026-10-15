import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { lightTheme } from '@alansar/theme';

const { colors, radius, spacing, typography, controls } = lightTheme;

type Props = Omit<TextInputProps, 'style' | 'onFocus' | 'onBlur'> & {
  label: string;
  error?: string;
  hint?: string;
};

export function TextField({ label, error, hint, ...input }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...input}
        placeholderTextColor={colors.placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityLabel={label}
        style={[styles.input, focused && styles.focused, !!error && styles.invalid]}
      />
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.titleSmall,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    height: controls.buttonHeight,
    paddingHorizontal: controls.inputPaddingX,
    borderRadius: radius.md,
    borderWidth: controls.borderWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    fontSize: 16,
    color: colors.text,
    // The border shows focus. On web, a zero-width solid outline replaces the
    // browser's `auto` focus ring, which ignores outline width.
    outlineStyle: 'solid',
    outlineWidth: 0,
  },
  focused: {
    borderColor: colors.primary,
    borderWidth: controls.focusBorderWidth,
  },
  invalid: {
    borderColor: colors.danger,
  },
  error: {
    ...typography.bodySmall,
    color: colors.danger,
    marginTop: spacing.sm,
  },
  hint: {
    ...typography.bodySmall,
    color: colors.textSubtle,
    marginTop: spacing.sm,
  },
});
