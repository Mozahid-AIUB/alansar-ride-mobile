import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { CurrencyCircleDollar, MapPinLine, SteeringWheel } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useT } from '@alansar/i18n';
import { gradients, lightTheme, onHero } from '@alansar/theme';
import { formatTaka } from '@alansar/utils';

import { PressableScale } from '@/components/PressableScale';
import { RideRequestCard } from '@/features/requests/RideRequestCard';
import { useAvailableRides, useDriverEarnings } from '@/hooks/queries';
import { useSession } from '@/hooks/useSession';
import { driverStatus, useDriverOnline } from '@/store/driverStatus';

const { colors, spacing, radius, typography, shadows } = lightTheme;

/** Driver home: go online to receive ride requests, with today's trips and earnings. */
export function DriverHomeScreen() {
  const insets = useSafeAreaInsets();
  const t = useT();
  const state = useSession();
  const online = useDriverOnline();
  const [busy, setBusy] = useState(false);
  const earnings = useDriverEarnings();
  const requests = useAvailableRides(online);

  const name = state.status === 'signedIn' ? (state.user.full_name?.split(' ')[0] ?? 'driver') : 'driver';
  const todayRides = Number(earnings.data?.today_rides ?? 0);
  const todayEarnings = Number(earnings.data?.today_earnings ?? 0);
  const rides = requests.data ?? [];

  const onToggle = async () => {
    setBusy(true);
    await driverStatus.toggle();
    setBusy(false);
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient {...gradients.header} style={[styles.hero, { paddingTop: insets.top + spacing.lg }]}>
          <Text style={styles.greeting}>{t('driverHome.greeting', { name })}</Text>

          <View style={[styles.statusCard, online ? styles.statusOnline : styles.statusOffline]}>
            <View style={styles.statusIcon}>
              <SteeringWheel size={28} color={online ? colors.brand : colors.textSubtle} weight="fill" />
            </View>
            <View style={styles.statusText}>
              <Text style={styles.statusTitle}>{online ? t('driverHome.online') : t('driverHome.offline')}</Text>
              <Text style={styles.statusBody}>{online ? t('driverHome.onlineBody') : t('driverHome.offlineBody')}</Text>
            </View>
          </View>

          <PressableScale
            accessibilityRole="button"
            style={[styles.toggle, online ? styles.toggleOff : styles.toggleOn]}
            disabled={busy}
            onPress={() => void onToggle()}
          >
            {busy ? (
              <ActivityIndicator color={online ? colors.text : colors.onPrimary} />
            ) : (
              <Text style={[styles.toggleText, online ? styles.toggleTextOff : styles.toggleTextOn]}>
                {online ? t('driverHome.goOffline') : t('driverHome.goOnline')}
              </Text>
            )}
          </PressableScale>
        </LinearGradient>

        <View style={styles.body}>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <MapPinLine size={22} color={colors.brand} weight="duotone" />
              <Text style={styles.statValue}>{todayRides}</Text>
              <Text style={styles.statLabel}>{t('driverHome.today')}</Text>
            </View>
            <View style={styles.stat}>
              <CurrencyCircleDollar size={22} color={colors.brand} weight="duotone" />
              <Text style={styles.statValue}>{formatTaka(todayEarnings)}</Text>
              <Text style={styles.statLabel}>{t('driverHome.earnings')}</Text>
            </View>
          </View>

          {online && rides.length ? (
            <View style={styles.requestList}>
              {rides.map((ride) => (
                <RideRequestCard key={ride.id} ride={ride} />
              ))}
            </View>
          ) : (
            <View style={styles.requests}>
              <Text style={styles.requestsText}>
                {online ? t('driverHome.noRequests') : t('driverHome.offlineBody')}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingBottom: spacing.xl,
  },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl + spacing.lg,
  },
  greeting: {
    ...typography.title,
    color: onHero.text,
    marginBottom: spacing.lg,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: onHero.glass,
    borderWidth: 1,
  },
  statusOnline: {
    borderColor: colors.brand,
  },
  statusOffline: {
    borderColor: onHero.glassBorder,
  },
  statusIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    flex: 1,
  },
  statusTitle: {
    ...typography.titleSmall,
    color: onHero.text,
  },
  statusBody: {
    ...typography.caption,
    color: onHero.textMuted,
    marginTop: 2,
  },
  toggle: {
    height: 54,
    marginTop: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleOn: {
    backgroundColor: colors.brand,
  },
  toggleOff: {
    backgroundColor: colors.surface,
  },
  toggleText: {
    ...typography.bodyStrong,
  },
  toggleTextOn: {
    color: colors.onPrimary,
  },
  toggleTextOff: {
    color: colors.text,
  },
  body: {
    marginTop: -spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    boxShadow: shadows.card,
  },
  statValue: {
    ...typography.headline,
    color: colors.text,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  requests: {
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
  },
  requestsText: {
    ...typography.bodySmall,
    color: colors.textSubtle,
    textAlign: 'center',
  },
  requestList: {
    gap: spacing.md,
  },
});
