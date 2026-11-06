import type { ComponentType } from 'react';
import { Platform, type ColorValue } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';
import { House, UserCircle, type IconProps } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useT } from '@alansar/i18n';
import { fonts, lightTheme } from '@alansar/theme';

const { colors } = lightTheme;

export const unstable_settings = { initialRouteName: 'home' };

const icon =
  (Icon: ComponentType<IconProps>) =>
  ({ color, focused }: { color: ColorValue; focused: boolean }) => (
    <Icon size={24} color={color as string} weight={focused ? 'fill' : 'regular'} />
  );

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const t = useT();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textSubtle,
        tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 11, lineHeight: 16 },
        tabBarStyle: {
          height: 66 + insets.bottom,
          paddingTop: 4,
          paddingBottom: insets.bottom + 4,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}
      screenListeners={{
        tabPress: () => {
          if (Platform.OS !== 'web') void Haptics.selectionAsync();
        },
      }}
    >
      <Tabs.Screen name="home" options={{ title: t('tab.home'), tabBarIcon: icon(House) }} />
      <Tabs.Screen name="account" options={{ title: t('tab.account'), tabBarIcon: icon(UserCircle) }} />
    </Tabs>
  );
}
