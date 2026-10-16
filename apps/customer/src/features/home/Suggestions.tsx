import { StyleSheet, Text, View } from 'react-native';
import { CalendarBlank } from 'phosphor-react-native';

import type { VehicleType } from '@alansar/api';
import { lightTheme } from '@alansar/theme';

import { VehicleArt } from '@/components/illustrations/VehicleArt';
import { PressableScale } from '@/components/PressableScale';
import { Skeleton } from '@/components/Skeleton';

const { colors, radius, spacing, typography, shadows } = lightTheme;

/** Uber-style row of four: the three vehicle types with most drivers free, then Schedule. */
export function Suggestions({
  vehicles,
  onPick,
  onSchedule,
}: {
  vehicles: VehicleType[] | undefined;
  onPick: (vehicle: VehicleType) => void;
  onSchedule: () => void;
}) {
  return (
    <View style={styles.row}>
      {vehicles
        ? vehicles.slice(0, 3).map((v) => (
            <PressableScale
              key={v.id}
              accessibilityRole="button"
              accessibilityLabel={v.name}
              style={styles.tile}
              onPress={() => onPick(v)}
            >
              <View style={styles.art}>
                <VehicleArt slug={v.slug} width={58} />
                {v.online_count > 0 ? <View style={styles.liveDot} /> : null}
              </View>
              <Text style={styles.label} numberOfLines={1}>
                {v.name}
              </Text>
            </PressableScale>
          ))
        : [0, 1, 2].map((i) => (
            <View key={i} style={styles.tile}>
              <Skeleton width="100%" height={56} />
              <Skeleton width="70%" height={11} style={styles.skeletonLabel} />
            </View>
          ))}
      <PressableScale accessibilityRole="button" style={styles.tile} onPress={onSchedule}>
        <View style={styles.art}>
          <CalendarBlank size={28} color={colors.brand} weight="duotone" />
        </View>
        <Text style={styles.label}>Schedule</Text>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm + 2,
  },
  tile: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  art: {
    alignSelf: 'stretch',
    height: 60,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    boxShadow: shadows.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.brand,
  },
  label: {
    ...typography.caption,
    color: colors.text,
  },
  skeletonLabel: {
    marginTop: 2,
  },
});
