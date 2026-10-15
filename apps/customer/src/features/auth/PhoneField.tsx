import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { lightTheme } from '@alansar/theme';
import { bdSignificantDigits, formatBdSignificant } from '@alansar/utils';

const { colors, radius, spacing, typography, controls } = lightTheme;

type Props = {
  /** Significant digits only, e.g. `1712345678`. */
  value: string;
  onChange: (digits: string) => void;
  error?: string;
  onSubmit?: () => void;
};

export function PhoneField({ value, onChange, error, onSubmit }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View>
      <View style={[styles.field, focused && styles.focused, !!error && styles.invalid]}>
        <View style={styles.country}>
          <Text style={styles.flag}>🇧🇩</Text>
          <Text style={styles.code}>+880</Text>
        </View>
        <View style={styles.divider} />
        <TextInput
          value={formatBdSignificant(value)}
          onChangeText={(text) => onChange(bdSignificantDigits(text))}
          placeholder="1712-345678"
          placeholderTextColor={colors.placeholder}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
          autoFocus
          returnKeyType="done"
          onSubmitEditing={onSubmit}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel="Mobile number"
          style={styles.input}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    height: controls.buttonHeight + 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: controls.borderWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  focused: {
    borderColor: colors.primary,
    borderWidth: controls.focusBorderWidth,
  },
  invalid: {
    borderColor: colors.danger,
  },
  country: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.md,
  },
  flag: {
    fontSize: 20,
  },
  code: {
    ...typography.titleSmall,
    color: colors.text,
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    marginVertical: spacing.md - 2,
    backgroundColor: colors.border,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: spacing.md,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: colors.text,
    // The field's own border shows focus. On web, a zero-width solid outline
    // replaces the browser's `auto` focus ring, which ignores outline width.
    outlineStyle: 'solid',
    outlineWidth: 0,
  },
  error: {
    ...typography.bodySmall,
    color: colors.danger,
    marginTop: spacing.sm,
  },
});
