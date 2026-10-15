import { useState, type ComponentType } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import type { IconProps } from 'phosphor-react-native';

import { lightTheme } from '@alansar/theme';

const { colors, radius, spacing, typography, controls } = lightTheme;

export function FieldLabel({ children }: { children: string }) {
  return <Text style={styles.label}>{children}</Text>;
}

export function FieldMessage({ error, hint }: { error?: string; hint?: string }) {
  if (error) return <Text style={styles.error}>{error}</Text>;
  if (hint) return <Text style={styles.hint}>{hint}</Text>;
  return null;
}

type Props = Omit<TextInputProps, 'style' | 'onFocus' | 'onBlur'> & {
  label: string;
  icon?: ComponentType<IconProps>;
  error?: string;
  hint?: string;
};

export function TextField({ label, icon: Icon, error, hint, ...input }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View>
      <FieldLabel>{label}</FieldLabel>
      <View style={[styles.field, focused && styles.focused, !!error && styles.invalid]}>
        {Icon ? (
          <Icon
            size={20}
            color={focused ? colors.primary : colors.placeholder}
            weight={focused ? 'duotone' : 'regular'}
          />
        ) : null}
        <TextInput
          {...input}
          placeholderTextColor={colors.placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={label}
          style={styles.input}
        />
      </View>
      <FieldMessage error={error} hint={hint} />
    </View>
  );
}

/** Shared by TextField and PhoneField so every input reads the same. */
export const fieldStyles = StyleSheet.create({
  field: {
    height: controls.buttonHeight,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: controls.borderWidth,
    borderColor: colors.border,
    backgroundColor: colors.inputFill,
  },
  focused: {
    borderColor: colors.primary,
    borderWidth: controls.focusBorderWidth,
    backgroundColor: colors.surface,
  },
  invalid: {
    borderColor: colors.danger,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: colors.text,
    // The field's border shows focus. On web, a zero-width solid outline
    // replaces the browser's `auto` focus ring, which ignores outline width.
    outlineStyle: 'solid',
    outlineWidth: 0,
  },
});

const styles = StyleSheet.create({
  ...fieldStyles,
  field: {
    ...fieldStyles.field,
    gap: spacing.sm + 4,
    paddingHorizontal: controls.inputPaddingX,
  },
  label: {
    ...typography.titleSmall,
    color: colors.text,
    marginBottom: spacing.sm,
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
