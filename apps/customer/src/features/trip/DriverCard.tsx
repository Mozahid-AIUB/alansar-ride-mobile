import { Linking, StyleSheet, Text, View } from 'react-native';
import { Phone, Star } from 'phosphor-react-native';

import type { RideDetail } from '@alansar/api';
import { lightTheme } from '@alansar/theme';
import { initialsOf } from '@alansar/utils';

import { VehicleArt } from '@/components/illustrations/VehicleArt';
import { PressableScale } from '@/components/PressableScale';

const { colors, spacing, radius, typography } = lightTheme;

/** Who is coming: name, rating, the plate to look for, and a call button. */
export function DriverCard({ ride }: { ride: RideDetail }) {
  const name = ride.driver_name || 'Your driver';
  const rating = ride.driver_rating ? Number(ride.driver_rating) : null;

  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initialsOf(name) || 'D'}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <View style={styles.metaRow}>
          {rating ? (
            <View style={styles.rating}>
              <Star size={12} color={colors.star} weight="fill" />
              <Text style={styles.meta}>{rating.toFixed(1)}</Text>
            </View>
          ) : null}
          <Text style={styles.meta} numberOfLines={1}>
            {ride.vehicle_type_name ?? 'Vehicle'}
          </Text>
        </View>
        {ride.vehicle_number ? (
          <View style={styles.plate}>
            <Text style={styles.plateText}>{ride.vehicle_number}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.side}>
        <VehicleArt slug={ride.vehicle_type_slug ?? 'car'} width={64} />
        {ride.driver_phone ? (
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={`Call ${name}`}
            style={styles.call}
            onPress={() => void Linking.openURL(`tel:${ride.driver_phone}`)}
          >
            <Phone size={20} color={colors.onPrimary} weight="fill" />
          </PressableScale>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.title,
    color: colors.onPrimary,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...typography.title,
    color: colors.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  meta: {
    ...typography.caption,
    color: colors.textMuted,
  },
  plate: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.text,
  },
  plateText: {
    ...typography.label,
    letterSpacing: 0.8,
    color: colors.text,
  },
  side: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  call: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
