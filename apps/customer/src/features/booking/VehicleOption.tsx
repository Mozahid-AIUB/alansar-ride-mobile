import { StyleSheet, Text, View } from 'react-native';
import { User } from 'phosphor-react-native';

import type { FareEstimate, VehicleType } from '@alansar/api';
import { lightTheme } from '@alansar/theme';
import { formatTaka } from '@alansar/utils';

import { VehicleArt } from '@/components/illustrations/VehicleArt';
import { PressableScale } from '@/components/PressableScale';
import { Skeleton } from '@/components/Skeleton';

const { colors, spacing, radius, typography } = lightTheme;

type Props = {
  vehicle: VehicleType;
  estimate: FareEstimate | undefined;
  loading: boolean;
  selected: boolean;
  onPress: () => void;
};

/** One row of "Choose a ride": the vehicle, live availability and its quoted fare. */
export function VehicleOption({ vehicle, estimate, loading, selected, onPress }: Props) {
  const online = vehicle.online_count > 0;
  const minutes = estimate?.durationMinutes;

  return (
    <PressableScale
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={[styles.row, selected && styles.selected]}
      onPress={onPress}
    >
      <View style={styles.art}>
        <VehicleArt slug={vehicle.slug} width={64} />
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.name}>{vehicle.name}</Text>
          {vehicle.seats ? (
            <View style={styles.seats}>
              <User size={12} color={colors.textSubtle} weight="bold" />
              <Text style={styles.meta}>{vehicle.seats}</Text>
            </View>
          ) : null}
        </View>
        <Text style={[styles.meta, online && styles.metaOn]}>
          {online ? `${vehicle.online_count} nearby` : 'No drivers online'}
          {minutes ? ` · ${minutes} min trip` : ''}
        </Text>
      </View>
      {loading ? (
        <Skeleton width={56} height={18} />
      ) : (
        <Text style={styles.fare}>{estimate ? formatTaka(estimate.estimatedFare) : '—'}</Text>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
    padding: spacing.sm + 2,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  art: {
    width: 76,
    height: 50,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    ...typography.title,
    color: colors.text,
  },
  seats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  meta: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  metaOn: {
    color: colors.brandStrong,
  },
  fare: {
    ...typography.title,
    color: colors.text,
  },
});
