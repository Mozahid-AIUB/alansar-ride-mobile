import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { User } from 'phosphor-react-native';

import { assetUrl, type VehicleType } from '@alansar/api';
import { lightTheme } from '@alansar/theme';

import { VehicleArt } from '@/components/illustrations/VehicleArt';
import { PressableScale } from '@/components/PressableScale';
import { Skeleton } from '@/components/Skeleton';

const { colors, radius, spacing, typography, shadows } = lightTheme;

export const VEHICLE_CARD_WIDTH = 132;

export function VehicleCard({ vehicle, onPress }: { vehicle: VehicleType; onPress: () => void }) {
  const image = assetUrl(vehicle.image_url);
  const online = vehicle.online_count > 0;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${vehicle.name}, ${online ? `${vehicle.online_count} nearby` : 'no drivers online'}`}
      style={styles.card}
      onPress={onPress}
    >
      <View style={styles.art}>
        {image ? (
          <Image source={image} style={styles.image} contentFit="contain" />
        ) : (
          <VehicleArt slug={vehicle.slug} width={84} />
        )}
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {vehicle.name}
      </Text>
      <View style={styles.metaRow}>
        {vehicle.seats ? (
          <View style={styles.seats}>
            <User size={12} color={colors.textSubtle} weight="bold" />
            <Text style={styles.meta}>{vehicle.seats}</Text>
          </View>
        ) : null}
        <View style={[styles.dot, online ? styles.dotOn : styles.dotOff]} />
        <Text style={[styles.meta, online && styles.metaOn]} numberOfLines={1}>
          {online ? `${vehicle.online_count} nearby` : 'Offline'}
        </Text>
      </View>
    </PressableScale>
  );
}

export function VehicleCardSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton width="100%" height={64} />
      <Skeleton width="70%" height={14} style={styles.skeletonLine} />
      <Skeleton width="50%" height={12} style={styles.skeletonLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: VEHICLE_CARD_WIDTH,
    padding: spacing.sm + 4,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    boxShadow: shadows.card,
  },
  art: {
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 84,
    height: 52,
  },
  name: {
    ...typography.titleSmall,
    color: colors.text,
    marginTop: spacing.sm + 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 1,
    marginTop: 2,
  },
  seats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginRight: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotOn: {
    backgroundColor: colors.brand,
  },
  dotOff: {
    backgroundColor: colors.disabled,
  },
  meta: {
    ...typography.caption,
    color: colors.textSubtle,
    flexShrink: 1,
  },
  metaOn: {
    color: colors.brandStrong,
  },
  skeletonLine: {
    marginTop: spacing.sm,
  },
});
