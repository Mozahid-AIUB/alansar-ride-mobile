import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CaretRight, NavigationArrow } from 'phosphor-react-native';

import { lightTheme } from '@alansar/theme';

import { RouteMap } from '@/components/map/RouteMap';
import { PressableScale } from '@/components/PressableScale';
import { currentPlace } from '@/services/location';
import { booking, coordOf, startBooking, useBooking } from '@/store/booking';

const { colors, spacing, radius, typography, shadows } = lightTheme;

/** "You are here" on a live map; also sets the pickup so booking starts from it. */
export function HomeMapCard() {
  const { pickup } = useBooking();
  const [status, setStatus] = useState<'locating' | 'ready' | 'off'>(pickup ? 'ready' : 'locating');

  useEffect(() => {
    if (booking.get().pickup) return;
    let alive = true;
    void currentPlace().then((place) => {
      if (!alive) return;
      if (place) booking.set({ pickup: place });
      setStatus(place ? 'ready' : 'off');
    });
    return () => {
      alive = false;
    };
  }, []);

  const label =
    pickup?.name ?? (status === 'locating' ? 'Finding your location…' : 'Location is off. Tap to set a pickup');

  return (
    <PressableScale accessibilityRole="button" accessibilityLabel="Plan a ride from here" style={styles.card} onPress={() => startBooking()}>
      <View style={styles.map}>
        <RouteMap pickup={coordOf(pickup)} dropoff={null} interactive={false} showCaption={false} />
      </View>
      <View style={styles.footer}>
        <View style={styles.icon}>
          <NavigationArrow size={16} color={colors.brand} weight="fill" />
        </View>
        <View style={styles.text}>
          <Text style={styles.kicker}>{pickup ? 'Pickup from' : 'Your location'}</Text>
          <Text style={styles.place} numberOfLines={1}>
            {label}
          </Text>
        </View>
        <CaretRight size={18} color={colors.textSubtle} weight="bold" />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    boxShadow: shadows.card,
  },
  map: {
    height: 150,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.brandTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
  },
  kicker: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  place: {
    ...typography.bodyStrong,
    color: colors.text,
  },
});
