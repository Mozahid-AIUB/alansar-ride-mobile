import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Bell, Clock, MagnifyingGlass } from 'phosphor-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { describeError } from '@alansar/api';
import { gradients, lightTheme, onHero } from '@alansar/theme';
import { initialsOf } from '@alansar/utils';

import { Button } from '@/components/Button';
import { MapArt } from '@/components/illustrations/MapArt';
import { VehicleArt } from '@/components/illustrations/VehicleArt';
import { Notice } from '@/components/Notice';
import { PressableScale } from '@/components/PressableScale';
import { Toast, useToast } from '@/components/Toast';
import {
  byAvailability,
  useRideHistory,
  useUnreadCount,
  useVehicleAvailability,
} from '@/hooks/queries';
import { useSession } from '@/hooks/useSession';
import { RideRow } from '@/features/rides/RideRow';

import { FareBanner } from './FareBanner';
import { Suggestions } from './Suggestions';

const { colors, spacing, radius, typography, shadows, controls } = lightTheme;

const BOOKING_NEXT = 'Booking a ride is the next screen we build.';

const enter = (delay: number) => FadeInDown.delay(delay).duration(460);

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const state = useSession();
  const toast = useToast();
  const vehicles = useVehicleAvailability();
  const history = useRideHistory(3);
  const unread = useUnreadCount().data ?? 0;

  if (state.status !== 'signedIn') return null;
  const name = state.user.full_name?.trim() || 'there';
  const onlineTotal = (vehicles.data ?? []).reduce((sum, v) => sum + v.online_count, 0);
  const rides = history.data?.items ?? [];

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient
          {...gradients.header}
          style={[styles.hero, { paddingTop: insets.top + spacing.md }]}
        >
          <MapArt quiet />

          <View style={styles.topRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initialsOf(name) || 'A'}</Text>
            </View>
            <View style={styles.hello}>
              <Text style={styles.helloSmall}>{greeting()},</Text>
              <Text style={styles.helloName} numberOfLines={1}>
                {name.split(' ')[0]}
              </Text>
            </View>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              hitSlop={8}
              style={styles.glassButton}
              onPress={() => router.push('/notifications')}
            >
              <Bell size={20} color={onHero.text} weight="bold" />
              {unread ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unread > 9 ? '9+' : unread}</Text>
                </View>
              ) : null}
            </PressableScale>
          </View>

          <Animated.Text entering={enter(0)} style={styles.heroTitle}>
            Where are you{'\n'}going today?
          </Animated.Text>
          {vehicles.data ? (
            <Animated.View entering={enter(60)} style={styles.livePill}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>
                {onlineTotal > 0
                  ? `${onlineTotal} driver${onlineTotal === 1 ? '' : 's'} online near you`
                  : 'No drivers online right now'}
              </Text>
            </Animated.View>
          ) : null}
        </LinearGradient>

        <View style={styles.body}>
          <Animated.View entering={enter(100)}>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Where to?"
              style={styles.search}
              onPress={() => toast.show(BOOKING_NEXT)}
            >
              <View style={styles.searchIcon}>
                <MagnifyingGlass size={20} color={colors.onPrimary} weight="bold" />
              </View>
              <Text style={styles.searchText}>Where to?</Text>
              <View style={styles.nowChip}>
                <Clock size={15} color={colors.text} weight="bold" />
                <Text style={styles.nowText}>Now</Text>
              </View>
            </PressableScale>
          </Animated.View>

          <Animated.View entering={enter(160)}>
            <SectionTitle
              title="Suggestions"
              action={{ label: 'See all', onPress: () => router.navigate('/services') }}
            />
            {vehicles.isError ? (
              <Notice tone="error" message={describeError(vehicles.error)} />
            ) : (
              <Suggestions
                vehicles={vehicles.data ? [...vehicles.data].sort(byAvailability) : undefined}
                onPick={() => toast.show(BOOKING_NEXT)}
                onSchedule={() => toast.show('Scheduling opens together with booking.')}
              />
            )}
          </Animated.View>

          <Animated.View entering={enter(280)}>
            <FareBanner />
          </Animated.View>

          <Animated.View entering={enter(340)}>
            <SectionTitle
              title="Recent rides"
              action={rides.length ? { label: 'See all', onPress: () => router.navigate('/activity') } : undefined}
            />
            <View style={styles.card}>
              {history.isError ? (
                <Notice tone="error" message={describeError(history.error)} />
              ) : rides.length ? (
                rides.map((ride, i) => (
                  <View key={ride.id} style={i > 0 && styles.divider}>
                    <RideRow ride={ride} />
                  </View>
                ))
              ) : history.isPending ? (
                <Text style={styles.muted}>Loading your rides…</Text>
              ) : (
                <View style={styles.empty}>
                  <View style={styles.emptyArt}>
                    <VehicleArt slug="car" width={96} />
                  </View>
                  <Text style={styles.emptyTitle}>Your first ride is a tap away</Text>
                  <Text style={styles.emptyBody}>Trips you take will show up here.</Text>
                  <View style={styles.emptyAction}>
                    <Button label="Book a ride" onPress={() => toast.show(BOOKING_NEXT)} />
                  </View>
                </View>
              )}
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      <Toast toast={toast.toast} />
    </View>
  );
}

function SectionTitle({
  title,
  action,
}: {
  title: string;
  action?: { label: string; onPress: () => void };
}) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <Text style={styles.sectionAction} onPress={action.onPress} accessibilityRole="link">
          {action.label}
        </Text>
      ) : null}
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
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: radius.pill,
    backgroundColor: onHero.glass,
    borderWidth: 2,
    borderColor: lightTheme.colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.titleSmall,
    color: onHero.text,
  },
  hello: {
    flex: 1,
  },
  helloSmall: {
    ...typography.caption,
    color: onHero.textMuted,
  },
  helloName: {
    ...typography.title,
    color: onHero.text,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 19,
    height: 19,
    paddingHorizontal: 4,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: lightTheme.colors.primary,
    backgroundColor: lightTheme.colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    ...typography.label,
    fontSize: 10,
    lineHeight: 12,
    color: onHero.text,
  },
  glassButton: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: onHero.glass,
    borderWidth: controls.borderWidth,
    borderColor: onHero.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    ...typography.display,
    color: onHero.text,
    marginTop: spacing.lg,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.sm,
    marginTop: spacing.sm + 4,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    backgroundColor: onHero.glass,
    borderWidth: controls.borderWidth,
    borderColor: onHero.glassBorder,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: lightTheme.colors.brand,
  },
  liveText: {
    ...typography.caption,
    color: onHero.text,
  },
  body: {
    marginTop: -spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  search: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
    paddingLeft: spacing.sm + 2,
    paddingRight: spacing.sm + 2,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    boxShadow: shadows.raised,
  },
  searchIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchText: {
    ...typography.title,
    flex: 1,
    color: colors.text,
  },
  nowChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 1,
    height: 40,
    paddingHorizontal: spacing.sm + 4,
    borderRadius: radius.md,
    backgroundColor: colors.background,
  },
  nowText: {
    ...typography.titleSmall,
    color: colors.text,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: spacing.sm + 4,
  },
  sectionTitle: {
    ...typography.headline,
    color: colors.text,
  },
  sectionAction: {
    ...typography.titleSmall,
    color: colors.brandStrong,
  },
  card: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    boxShadow: shadows.card,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  muted: {
    ...typography.bodySmall,
    color: colors.textSubtle,
    paddingVertical: spacing.md,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  emptyArt: {
    width: 128,
    height: 76,
    borderRadius: radius.lg,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.title,
    color: colors.text,
  },
  emptyBody: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  emptyAction: {
    alignSelf: 'stretch',
    marginTop: spacing.md + 4,
  },
});
