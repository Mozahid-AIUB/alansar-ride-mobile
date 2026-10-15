import { useState, type ComponentType, type ReactNode } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import type { IconProps } from 'phosphor-react-native';

import { lightTheme } from '@alansar/theme';

const { colors, radius, spacing, typography, controls } = lightTheme;

export function FieldError({ error }: { error?: string }) {
  return error ? <Text style={styles.error}>{error}</Text> : null;
}

export type TextFieldProps = Omit<TextInputProps, 'style' | 'onFocus' | 'onBlur' | 'placeholder'> & {
  /** Shown as the placeholder and read out by screen readers. */
  label: string;
  icon?: ComponentType<IconProps>;
  /** Rendered inside the field after the input, e.g. a show-password toggle. */
  trailing?: ReactNode;
  error?: string;
};

/** Icon, input and optional trailing control in one compact field. */
export function TextField({ label, icon: Icon, trailing, error, ...input }: TextFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View>
      <View style={[styles.field, focused && fieldStyles.focused, !!error && fieldStyles.invalid]}>
        {Icon ? (
          <Icon
            size={20}
            color={focused ? colors.primary : colors.placeholder}
            weight={focused ? 'duotone' : 'regular'}
          />
        ) : null}
        <TextInput
          {...input}
          placeholder={label}
          placeholderTextColor={colors.placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={label}
          style={fieldStyles.input}
        />
        {trailing}
      </View>
      <FieldError error={error} />
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
  field: {
    ...fieldStyles.field,
    gap: spacing.sm + 4,
    paddingHorizontal: controls.inputPaddingX,
  },
  error: {
    ...typography.bodySmall,
    color: colors.danger,
    marginTop: spacing.xs + 2,
    marginLeft: spacing.xs,
  },
});
