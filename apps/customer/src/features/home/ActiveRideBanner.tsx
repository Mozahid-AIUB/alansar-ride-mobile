import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { CaretRight, NavigationArrow } from 'phosphor-react-native';

import type { RideDetail } from '@alansar/api';
import { useT, type TranslationKey } from '@alansar/i18n';
import { lightTheme, onHero } from '@alansar/theme';
import { formatRideDate } from '@alansar/utils';

import { PressableScale } from '@/components/PressableScale';

const { colors, spacing, radius, typography, shadows } = lightTheme;

type Translate = (key: TranslationKey, vars?: Record<string, string | number>) => string;

const describe = (ride: RideDetail, t: Translate) => {
  if (ride.status === 'requested' && ride.scheduled_for && !ride.dispatched_at) {
    return t('banner.scheduled', { when: formatRideDate(ride.scheduled_for) });
  }
  if (ride.status === 'requested') return t('banner.finding');
  if (ride.status === 'accepted') return ride.arrived_at ? t('banner.driverHere') : t('banner.onWay');
  if (ride.status === 'started') return t('banner.started');
  return t('banner.yourRide');
};

/** Back into a ride that is still going, from anywhere on Home. */
export function ActiveRideBanner({ ride }: { ride: RideDetail }) {
  const t = useT();
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
        <Text style={styles.title}>{describe(ride, t)}</Text>
        <Text style={styles.body} numberOfLines={1}>
          {t('banner.to', { dest: ride.dropoff_name ?? ride.dropoff_address ?? t('banner.destination') })}
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
