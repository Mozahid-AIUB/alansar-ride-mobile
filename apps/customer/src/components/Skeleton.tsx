import { useEffect } from 'react';
import type { DimensionValue, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { lightTheme } from '@alansar/theme';

const { colors, radius } = lightTheme;

/** Pulsing placeholder block shown while data loads. */
export function Skeleton({
  width,
  height,
  style,
}: {
  width: DimensionValue;
  height: number;
  style?: StyleProp<ViewStyle>;
}) {
  const opacity = useSharedValue(0.55);

  useEffect(() => {
    opacity.set(withRepeat(withTiming(1, { duration: 700 }), -1, true));
  }, [opacity]);

  const pulse = useAnimatedStyle(() => ({ opacity: opacity.get() }));

  return (
    <Animated.View
      style={[
        { width, height, borderRadius: radius.sm, backgroundColor: colors.backgroundAlt },
        pulse,
        style,
      ]}
    />
  );
}
