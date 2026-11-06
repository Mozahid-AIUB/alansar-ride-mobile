import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, NavigationArrow, Phone } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { driversApi, type RideDetail } from '@alansar/api';
import { useT } from '@alansar/i18n';
import { gradients, lightTheme, onHero } from '@alansar/theme';
import { formatBdPhone, formatTaka, initialsOf } from '@alansar/utils';

import { PressableScale } from '@/components/PressableScale';

const { colors, spacing, radius, typography, shadows } = lightTheme;

/**
 * The driver's current trip: who to pick up, where to, and the one action the
 * trip's stage calls for — arrive, start, or complete.
 */
export function DriverTripScreen({ ride }: { ride: RideDetail }) {
  const insets = useSafeAreaInsets();
  const t = useT();
  const queryClient = useQueryClient();

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ['driver', 'active-trip'] });
    void queryClient.invalidateQueries({ queryKey: ['driver', 'earnings'] });
  };

  const action = useMutation({
    mutationFn: (step: 'arrive' | 'start' | 'complete') =>
      step === 'arrive' ? driversApi.arrive(ride.id) : step === 'start' ? driversApi.start(ride.id) : driversApi.complete(ride.id),
    onSuccess: refresh,
  });

  const riderName = ride.customer_name ?? t('dtrip.rider');
  const fare = formatTaka(Number(ride.agreed_fare ?? ride.requested_fare ?? 0));

  // Which stage are we in, and what's the one button?
  const stage =
    ride.status === 'accepted' && !ride.arrived_at
      ? { title: t('dtrip.toPickup'), body: t('dtrip.toPickupBody', { name: riderName, place: ride.pickup_name ?? '—' }), cta: t('dtrip.arrived'), step: 'arrive' as const }
      : ride.status === 'accepted'
        ? { title: t('dtrip.toPickup'), body: t('dtrip.toPickupBody', { name: riderName, place: ride.pickup_name ?? '—' }), cta: t('dtrip.start'), step: 'start' as const }
        : { title: t('dtrip.onTrip'), body: t('dtrip.onTripBody', { name: riderName, place: ride.dropoff_name ?? '—' }), cta: t('dtrip.complete'), step: 'complete' as const };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }} showsVerticalScrollIndicator={false}>
        <LinearGradient {...gradients.header} style={[styles.hero, { paddingTop: insets.top + spacing.lg }]}>
          <Text style={styles.stageTitle}>{stage.title}</Text>
          <Text style={styles.stageBody}>{stage.body}</Text>
        </LinearGradient>

        <View style={styles.body}>
          <View style={styles.riderCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initialsOf(riderName) || 'R'}</Text>
            </View>
            <View style={styles.riderText}>
              <Text style={styles.riderName}>{riderName}</Text>
              <Text style={styles.fare}>{t('dtrip.fare')}: {fare}</Text>
            </View>
            {ride.customer_phone ? (
              <PressableScale
                accessibilityRole="button"
                style={styles.callButton}
                onPress={() => void Linking.openURL(`tel:${ride.customer_phone}`)}
              >
                <Phone size={20} color={colors.brand} weight="fill" />
              </PressableScale>
            ) : null}
          </View>

          <View style={styles.routeCard}>
            <Line icon={NavigationArrow} label={t('dtrip.pickup')} text={ride.pickup_name ?? ride.pickup_address ?? '—'} />
            <View style={styles.divider} />
            <Line icon={MapPin} label={t('dtrip.dropoff')} text={ride.dropoff_name ?? ride.dropoff_address ?? '—'} />
          </View>

          {action.isError ? <Text style={styles.error}>{t('dtrip.actionFailed')}</Text> : null}

          <PressableScale
            accessibilityRole="button"
            style={styles.cta}
            disabled={action.isPending}
            onPress={() => action.mutate(stage.step)}
          >
            <Text style={styles.ctaText}>{stage.cta}</Text>
          </PressableScale>
        </View>
      </ScrollView>
    </View>
  );
}

function Line({ icon: Icon, label, text }: { icon: typeof MapPin; label: string; text: string }) {
  return (
    <View style={styles.line}>
      <Icon size={18} color={colors.brand} weight="fill" />
      <View style={styles.lineText}>
        <Text style={styles.lineLabel}>{label}</Text>
        <Text style={styles.lineValue} numberOfLines={1}>
          {text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl + spacing.lg,
  },
  stageTitle: {
    ...typography.headline,
    color: onHero.text,
  },
  stageBody: {
    ...typography.body,
    color: onHero.textMuted,
    marginTop: spacing.xs,
  },
  body: {
    marginTop: -spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  riderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    boxShadow: shadows.card,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.brandTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.titleSmall,
    color: colors.brand,
  },
  riderText: {
    flex: 1,
  },
  riderName: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  fare: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.brandTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeCard: {
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
  },
  lineText: {
    flex: 1,
  },
  lineLabel: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  lineValue: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  divider: {
    height: 14,
    width: 2,
    marginLeft: 8,
    marginVertical: 4,
    backgroundColor: colors.border,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
  },
  cta: {
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    ...typography.title,
    color: colors.onPrimary,
  },
});
