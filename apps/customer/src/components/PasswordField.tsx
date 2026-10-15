import { useState } from 'react';
import { Pressable } from 'react-native';
import { Eye, EyeSlash, LockSimple } from 'phosphor-react-native';

import { lightTheme } from '@alansar/theme';

import { TextField, type TextFieldProps } from './TextField';

const { colors } = lightTheme;

type Props = Omit<TextFieldProps, 'icon' | 'trailing' | 'secureTextEntry'>;

/** Text field with a lock icon and a show / hide toggle. */
export function PasswordField(props: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      {...props}
      icon={LockSimple}
      secureTextEntry={!visible}
      autoCapitalize="none"
      autoCorrect={false}
      trailing={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={visible ? 'Hide password' : 'Show password'}
          hitSlop={10}
          onPress={() => setVisible((v) => !v)}
        >
          {visible ? (
            <EyeSlash size={20} color={colors.textSubtle} />
          ) : (
            <Eye size={20} color={colors.textSubtle} />
          )}
        </Pressable>
      }
    />
  );
}
