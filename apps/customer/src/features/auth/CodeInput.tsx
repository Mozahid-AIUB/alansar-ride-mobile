import { useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { fonts, lightTheme } from '@alansar/theme';

const { colors, radius, spacing, controls } = lightTheme;

type Props = {
  value: string;
  onChange: (code: string) => void;
  length?: number;
  invalid?: boolean;
};

/**
 * One-time-code boxes. A single invisible TextInput covers the row, so paste
 * and SMS autofill (iOS `oneTimeCode`, Android `sms-otp`) fill every box at once.
 */
export function CodeInput({ value, onChange, length = 6, invalid = false }: Props) {
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);
  const active = Math.min(value.length, length - 1);

  return (
    <Pressable style={styles.row} onPress={() => inputRef.current?.focus()}>
      {Array.from({ length }, (_, i) => {
        const digit = value[i];
        return (
          <View
            key={i}
            style={[
              styles.cell,
              digit !== undefined && styles.filled,
              focused && i === active && styles.active,
              invalid && styles.invalid,
            ]}
          >
            {digit !== undefined ? (
              <Animated.Text entering={ZoomIn.duration(160)} style={styles.digit}>
                {digit}
              </Animated.Text>
            ) : null}
          </View>
        );
      })}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) => onChange(text.replace(/\D/g, '').slice(0, length))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={length}
        autoFocus
        caretHidden
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityLabel={`${length}-digit code`}
        style={styles.hiddenInput}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  cell: {
    flex: 1,
    maxWidth: 56,
    height: controls.buttonHeight + 4,
    borderRadius: radius.md,
    borderWidth: controls.borderWidth,
    borderColor: colors.border,
    backgroundColor: colors.inputFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filled: {
    backgroundColor: colors.surface,
  },
  active: {
    borderColor: colors.brand,
    borderWidth: controls.focusBorderWidth,
    backgroundColor: colors.surface,
  },
  invalid: {
    borderColor: colors.danger,
  },
  digit: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.text,
  },
  hiddenInput: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0,
  },
});
