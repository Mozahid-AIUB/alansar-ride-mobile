import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMutation } from '@tanstack/react-query';
import { CalendarCheck, CheckCircle, MagnifyingGlass, NavigationArrow, XCircle } from 'phosphor-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { describeError, ridesApi, type FareOffer, type RideDetail } from '@alansar/api';
import { lightTheme } from '@alansar/theme';
import { formatRideDate, formatTaka } from '@alansar/utils';

import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/Button';
import { RouteMap } from '@/components/map/RouteMap';
import { Notice } from '@/components/Notice';
import { PressableScale } from '@/components/PressableScale';
import { useInvalidateRides, useOffers, useRide, useRoute } from '@/hooks/queries';
import { startBooking, type Coord } from '@/store/booking';

import { DriverCard } from './DriverCard';
import { OffersList } from './OffersList';
import { RatingPanel } from './RatingPanel';

const { colors, spacing, radius, typography, shadows } = lightTheme;

const CANCEL_REASONS = ['Changed my plans', 'Driver is too far', 'Booked by mistake', 'Found another ride'];

const coord = (lat: unknown, lng: unknown): Coord | null =>
  lat !== null && lat !== undefined && lng !== null && lng !== undefined
    ? { latitude: Number(lat), longitude: Number(lng) }
    : null;

const isUpcoming = (ride: RideDetail) =>
  ride.status === 'requested' && !!ride.scheduled_for && !ride.dispatched_at;

/** What the passenger should know right now, by ride status. */
const headline = (ride: RideDetail) => {
  if (isUpcoming(ride)) return { title: 'Ride scheduled', body: `For ${formatRideDate(ride.scheduled_for ?? undefined)}. We'll find your driver ahead of time.` };
  switch (ride.status) {
    case 'requested':
      return { title: 'Finding your driver', body: 'Hang tight while we match you with a nearby driver.' };
    case 'accepted':
      return ride.arrived_at
        ? { title: 'Your driver is here', body: 'Meet them at the pickup point.' }
        : { title: 'Driver on the way', body: 'Your driver is heading to the pickup point.' };
    case 'started':
      return { title: 'On your way', body: `Heading to ${ride.dropoff_name ?? ride.dropoff_address ?? 'your destination'}.` };
    case 'completed':
      return { title: "You've arrived", body: 'Thanks for riding with Al Ansar.' };
    case 'cancelled':
      return { title: 'Ride cancelled', body: ride.cancellation_reason ?? 'This ride was cancelled.' };
    default:
      return { title: 'Your ride', body: '' };
  }
};

/** Live trip: polls the ride every few seconds and shows the step it is on. */
export function TripScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const ride = useRide(id);
  const data = ride.data;

  const lookingForDriver = !!data && data.status === 'requested' && !isUpcoming(data);
  const offers = useOffers(id, lookingForDriver);
  const pickup = data ? coord(data.pickup_lat, data.pickup_lng) : null;
  const dropoff = data ? coord(data.dropoff_lat, data.dropoff_lng) : null;
  const route = useRoute(pickup, dropoff);
  const driver =
    data && (data.status === 'accepted' || data.status === 'started') ? coord(data.driver_lat, data.driver_lng) : null;

  const invalidate = useInvalidateRides();
  const [busyOfferId, setBusyOfferId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const [rated, setRated] = useState(false);

  const offerAction = useMutation({
    mutationFn: ({ offer, accept }: { offer: FareOffer; accept: boolean }) =>
      accept ? ridesApi.acceptOffer(id, offer.id) : ridesApi.declineOffer(id, offer.id),
    onMutate: ({ offer }) => setBusyOfferId(offer.id),
    onSettled: () => {
      setBusyOfferId(null);
      void invalidate();
    },
  });

  const cancel = useMutation({
    mutationFn: () => ridesApi.cancel(id, reason ?? undefined),
    onSuccess: () => {
      setCancelling(false);
      void invalidate();
    },
  });

  const mapHeight = Math.round(height * 0.42);

  if (ride.isError && !data) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <Notice tone="error" message={describeError(ride.error)} />
        <Button variant="outline" label="Back to home" onPress={() => router.replace('/home')} />
      </View>
    );
  }

  const info = data ? headline(data) : null;
  const finished = data?.status === 'completed' || data?.status === 'cancelled';
  const canCancel = !!data && (data.status === 'requested' || data.status === 'accepted');
  const fare = data ? formatTaka(data.final_fare ?? data.agreed_fare ?? data.requested_fare) : '';

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <View style={{ height: mapHeight + radius.xl }}>
        <RouteMap
          pickup={pickup}
          dropoff={dropoff}
          route={route.data?.polyline.map((p) => ({ latitude: p.lat, longitude: p.lng }))}
          driver={driver}
          bottomInset={radius.xl}
        />
        <View style={[styles.back, { top: insets.top + spacing.sm }]}>
          <BackButton />
        </View>
      </View>

      <View style={styles.sheet}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.lg }]}
          showsVerticalScrollIndicator={false}
        >
          {!data || !info ? (
            <Text style={styles.muted}>Loading your ride…</Text>
          ) : (
            <>
              <View style={styles.status}>
                <StatusIcon ride={data} />
                <View style={styles.statusText}>
                  <Text style={styles.title}>{info.title}</Text>
                  {info.body ? <Text style={styles.body}>{info.body}</Text> : null}
                </View>
              </View>

              {lookingForDriver ? <SearchingBar /> : null}

              {data.driver_id && !finished ? <DriverCard ride={data} /> : null}

              {lookingForDriver ? (
                <OffersList
                  offers={offers.data ?? []}
                  busyId={busyOfferId}
                  onAccept={(offer) => offerAction.mutate({ offer, accept: true })}
                  onDecline={(offer) => offerAction.mutate({ offer, accept: false })}
                />
              ) : null}
              {offerAction.isError ? <Notice tone="error" message={describeError(offerAction.error)} /> : null}

              <View style={styles.tripCard}>
                <TripLine color="pickup" text={data.pickup_name ?? data.pickup_address ?? 'Pickup'} />
                <View style={styles.tripDivider} />
                <TripLine color="dropoff" text={data.dropoff_name ?? data.dropoff_address ?? 'Destination'} />
                <View style={styles.fareRow}>
                  <Text style={styles.fareLabel}>
                    {data.status === 'completed' ? 'Fare paid' : data.agreed_fare ? 'Agreed fare' : 'Your fare'}
                  </Text>
                  <Text style={styles.fare}>{fare}</Text>
                </View>
                <Text style={styles.cash}>Pay your driver in cash at the end of the trip.</Text>
              </View>

              {data.status === 'completed' && !rated ? (
                <RatingPanel
                  rideId={data.id}
                  driverName={data.driver_name?.split(' ')[0] ?? 'your driver'}
                  onDone={() => {
                    setRated(true);
                    void invalidate();
                  }}
                />
              ) : null}

              {finished && (data.status === 'cancelled' || rated) ? (
                <View style={styles.actions}>
                  <Button label="Book another ride" onPress={() => startBooking()} />
                  <Button variant="outline" label="Back to home" onPress={() => router.replace('/home')} />
                </View>
              ) : null}

              {canCancel ? (
                cancelling ? (
                  <View style={styles.cancelBox}>
                    <Text style={styles.cancelTitle}>Why are you cancelling?</Text>
                    <View style={styles.reasons}>
                      {CANCEL_REASONS.map((r) => (
                        <PressableScale
                          key={r}
                          accessibilityRole="button"
                          accessibilityState={{ selected: reason === r }}
                          style={[styles.reason, reason === r && styles.reasonSelected]}
                          onPress={() => setReason(r)}
                        >
                          <Text style={[styles.reasonText, reason === r && styles.reasonTextSelected]}>{r}</Text>
                        </PressableScale>
                      ))}
                    </View>
                    {cancel.isError ? <Notice tone="error" message={describeError(cancel.error)} /> : null}
                    <Button variant="danger" label="Cancel ride" loading={cancel.isPending} onPress={() => cancel.mutate()} />
                    <Button variant="outline" label="Keep my ride" onPress={() => setCancelling(false)} />
                  </View>
                ) : (
                  <Button variant="outline" label="Cancel ride" onPress={() => setCancelling(true)} />
                )
              ) : null}

              {data.ride_code ? <Text style={styles.code}>Ride {data.ride_code}</Text> : null}
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

function StatusIcon({ ride }: { ride: RideDetail }) {
  const { icon: Icon, tint, color } =
    ride.status === 'completed'
      ? { icon: CheckCircle, tint: colors.brandTint, color: colors.brand }
      : ride.status === 'cancelled'
        ? { icon: XCircle, tint: colors.dangerTint, color: colors.danger }
        : isUpcoming(ride)
          ? { icon: CalendarCheck, tint: colors.brandTint, color: colors.brand }
          : ride.status === 'requested'
            ? { icon: MagnifyingGlass, tint: colors.primaryTint, color: colors.text }
            : { icon: NavigationArrow, tint: colors.brandTint, color: colors.brand };
  return (
    <View style={[styles.statusIcon, { backgroundColor: tint }]}>
      <Icon size={24} color={color} weight="fill" />
    </View>
  );
}

/** Indeterminate progress bar while dispatch looks for a driver. */
function SearchingBar() {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.set(withRepeat(withTiming(1, { duration: 1400 }), -1, false));
  }, [progress]);
  const slide = useAnimatedStyle(() => ({ left: `${progress.get() * 100 - 35}%` }));
  return (
    <View style={styles.bar}>
      <Animated.View style={[styles.barFill, slide]} />
    </View>
  );
}

function TripLine({ color, text }: { color: 'pickup' | 'dropoff'; text: string }) {
  return (
    <View style={styles.tripLine}>
      <View style={color === 'pickup' ? styles.dotPickup : styles.dotDropoff} />
      <Text style={styles.tripText} numberOfLines={2}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  center: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.md,
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  back: {
    position: 'absolute',
    left: spacing.lg,
  },
  sheet: {
    flex: 1,
    marginTop: -radius.xl,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    backgroundColor: colors.background,
    boxShadow: shadows.raised,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  muted: {
    ...typography.bodySmall,
    color: colors.textSubtle,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    flex: 1,
  },
  title: {
    ...typography.headline,
    color: colors.text,
  },
  body: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  bar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: colors.backgroundAlt,
  },
  barFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '35%',
    borderRadius: 2,
    backgroundColor: colors.brand,
  },
  tripCard: {
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  tripLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
  },
  dotPickup: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.brand,
  },
  dotDropoff: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: colors.text,
  },
  tripText: {
    ...typography.bodyStrong,
    flex: 1,
    color: colors.text,
  },
  tripDivider: {
    height: 14,
    width: 2,
    marginLeft: 4,
    marginVertical: 2,
    backgroundColor: colors.border,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  fareLabel: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  fare: {
    ...typography.headline,
    color: colors.text,
  },
  cash: {
    ...typography.caption,
    color: colors.textSubtle,
    marginTop: 2,
  },
  actions: {
    gap: spacing.sm,
  },
  cancelBox: {
    gap: spacing.sm + 2,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  cancelTitle: {
    ...typography.titleSmall,
    color: colors.text,
  },
  reasons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  reason: {
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reasonSelected: {
    borderColor: colors.text,
    backgroundColor: colors.primary,
  },
  reasonText: {
    ...typography.caption,
    color: colors.text,
  },
  reasonTextSelected: {
    color: colors.onPrimary,
  },
  code: {
    ...typography.caption,
    color: colors.textSubtle,
    textAlign: 'center',
  },
});
