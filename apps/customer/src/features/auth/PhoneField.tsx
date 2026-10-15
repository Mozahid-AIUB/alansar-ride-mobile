import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { lightTheme } from '@alansar/theme';
import { bdSignificantDigits, formatBdSignificant } from '@alansar/utils';

import { FieldLabel, FieldMessage, fieldStyles } from '@/components/TextField';

const { colors, spacing, typography } = lightTheme;

type Props = {
  label: string;
  /** Significant digits only, e.g. `1712345678`. */
  value: string;
  onChange: (digits: string) => void;
  error?: string;
  onSubmit?: () => void;
  autoFocus?: boolean;
};

export function PhoneField({ label, value, onChange, error, onSubmit, autoFocus = false }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View>
      <FieldLabel>{label}</FieldLabel>
      <View style={[fieldStyles.field, focused && fieldStyles.focused, !!error && fieldStyles.invalid]}>
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
          autoFocus={autoFocus}
          returnKeyType="done"
          onSubmitEditing={onSubmit}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={label}
          style={[fieldStyles.input, styles.input]}
        />
      </View>
      <FieldMessage error={error} />
    </View>
  );
}

const styles = StyleSheet.create({
  country: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.md,
  },
  flag: {
    fontSize: 18,
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
    paddingHorizontal: spacing.md,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
});
