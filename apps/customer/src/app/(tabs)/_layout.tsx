import type { ComponentType } from 'react';
import { Platform, type ColorValue } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';
import {
  ClockCounterClockwise,
  House,
  SquaresFour,
  UserCircle,
  type IconProps,
} from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fonts, lightTheme } from '@alansar/theme';

const { colors } = lightTheme;

export const unstable_settings = { initialRouteName: 'home' };

const icon =
  (Icon: ComponentType<IconProps>) =>
  ({ color, focused }: { color: ColorValue; focused: boolean }) => (
    // The tab bar passes the plain tint strings set below.
    <Icon size={24} color={color as string} weight={focused ? 'fill' : 'regular'} />
  );

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textSubtle,
        // Each tab needs ~54px for icon, label and its own padding; the default
        // bar leaves 49, which squeezes Plus Jakarta Sans labels and clips them.
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
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: icon(House) }} />
      <Tabs.Screen name="services" options={{ title: 'Services', tabBarIcon: icon(SquaresFour) }} />
      <Tabs.Screen
        name="activity"
        options={{ title: 'Activity', tabBarIcon: icon(ClockCounterClockwise) }}
      />
      <Tabs.Screen name="account" options={{ title: 'Account', tabBarIcon: icon(UserCircle) }} />
    </Tabs>
  );
}
