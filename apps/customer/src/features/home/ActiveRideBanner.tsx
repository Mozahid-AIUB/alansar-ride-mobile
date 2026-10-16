import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { CaretRight, NavigationArrow } from 'phosphor-react-native';

import type { RideDetail } from '@alansar/api';
import { lightTheme, onHero } from '@alansar/theme';
import { formatRideDate } from '@alansar/utils';

import { PressableScale } from '@/components/PressableScale';

const { colors, spacing, radius, typography, shadows } = lightTheme;

const describe = (ride: RideDetail) => {
  if (ride.status === 'requested' && ride.scheduled_for && !ride.dispatched_at) {
    return `Scheduled · ${formatRideDate(ride.scheduled_for)}`;
  }
  if (ride.status === 'requested') return 'Finding your driver…';
  if (ride.status === 'accepted') return ride.arrived_at ? 'Your driver is here' : 'Driver on the way';
  if (ride.status === 'started') return 'On your way';
  return 'Your ride';
};

/** Back into a ride that is still going, from anywhere on Home. */
export function ActiveRideBanner({ ride }: { ride: RideDetail }) {
  return (
    <PressableScale
      accessibilityRole="button"
      style={styles.banner}
      onPress={() => router.push({ pathname: '/trip/[id]', params: { id: ride.id } })}
    >
      <View style={styles.icon}>
        <NavigationArrow size={20} color={colors.onPrimary} weight="fill" />
      </View>
      <View style={styles.text}>
        <Text style={styles.title}>{describe(ride)}</Text>
        <Text style={styles.body} numberOfLines={1}>
          To {ride.dropoff_name ?? ride.dropoff_address ?? 'your destination'}
        </Text>
      </View>
      <CaretRight size={18} color={onHero.text} weight="bold" />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    boxShadow: shadows.raised,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
  },
  title: {
    ...typography.titleSmall,
    color: onHero.text,
  },
  body: {
    ...typography.caption,
    color: onHero.textMuted,
  },
});
