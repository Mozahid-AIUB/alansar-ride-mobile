import { StyleSheet, Text, View } from 'react-native';

import type { Ride } from '@alansar/api';
import { lightTheme, rideStatusColor, rideStatusLabel } from '@alansar/theme';
import { formatRideDate, formatTaka } from '@alansar/utils';

import { VehicleArt } from '@/components/illustrations/VehicleArt';

const { colors, radius, spacing, typography } = lightTheme;

const placeName = (name: string | null, address: string | null) => name || address || 'Unknown place';

/** One past or current trip: route, when, fare and status. */
export function RideRow({ ride }: { ride: Ride }) {
  const statusColor = rideStatusColor(ride.status);
  const fare = formatTaka(ride.final_fare ?? ride.agreed_fare ?? ride.requested_fare);

  return (
    <View style={styles.row}>
      <View style={styles.art}>
        <VehicleArt slug={ride.vehicle_type_slug ?? 'car'} width={44} />
      </View>
      <View style={styles.body}>
        <Text style={styles.route} numberOfLines={1}>
          {placeName(ride.dropoff_name, ride.dropoff_address)}
        </Text>
        <Text style={styles.from} numberOfLines={1}>
          from {placeName(ride.pickup_name, ride.pickup_address)}
        </Text>
        <Text style={styles.meta}>
          {[formatRideDate(ride.created_at), ride.vehicle_type_name].filter(Boolean).join(' · ')}
        </Text>
      </View>
      <View style={styles.side}>
        {fare ? <Text style={styles.fare}>{fare}</Text> : null}
        {/* Status colours are 6-digit hex, so "1F" appends ~12% alpha for the badge fill. */}
        <View style={[styles.badge, { backgroundColor: `${statusColor}1F` }]}>
          <Text style={[styles.badgeText, { color: statusColor }]}>{rideStatusLabel(ride.status)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
    paddingVertical: spacing.sm + 4,
  },
  art: {
    width: 56,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  route: {
    ...typography.titleSmall,
    color: colors.text,
  },
  from: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  meta: {
    ...typography.caption,
    color: colors.textSubtle,
    marginTop: 2,
  },
  side: {
    alignItems: 'flex-end',
    gap: spacing.xs + 2,
  },
  fare: {
    ...typography.titleSmall,
    color: colors.text,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  badgeText: {
    ...typography.label,
  },
});
