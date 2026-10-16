import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMutation } from '@tanstack/react-query';
import { CalendarBlank, Clock, HandCoins } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { describeError, ridesApi } from '@alansar/api';
import { fonts, lightTheme } from '@alansar/theme';
import { formatTaka } from '@alansar/utils';

import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/Button';
import { RouteMap } from '@/components/map/RouteMap';
import { Notice } from '@/components/Notice';
import { PressableScale } from '@/components/PressableScale';
import {
  byAvailability,
  useEstimates,
  useInvalidateRides,
  useRoute,
  useVehicleAvailability,
} from '@/hooks/queries';
import { booking, coordOf, toEndpoint, useBooking } from '@/store/booking';

import { SchedulePicker } from './SchedulePicker';
import { VehicleOption } from './VehicleOption';

const { colors, spacing, radius, typography, controls, shadows } = lightTheme;

/** Booking step 2: route, ride type, fare and time, then the request itself. */
export function ReviewScreen() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { pickup, dropoff, vehicleTypeId, scheduling } = useBooking();

  const vehicles = useVehicleAvailability();
  const sorted = vehicles.data ? [...vehicles.data].sort(byAvailability) : [];
  const estimates = useEstimates(pickup, dropoff, sorted);
  const route = useRoute(coordOf(pickup), coordOf(dropoff));

  const [chosenId, setChosenId] = useState<string | null>(vehicleTypeId);
  const [fareMode, setFareMode] = useState<'suggested' | 'own'>('suggested');
  const [ownFare, setOwnFare] = useState('');
  const [later, setLater] = useState(scheduling);
  const [when, setWhen] = useState<Date | null>(null);

  const invalidate = useInvalidateRides();
  const request = useMutation({
    mutationFn: ridesApi.request,
    onSuccess: (ride) => {
      void invalidate();
      booking.set({ dropoff: null, vehicleTypeId: null, scheduling: false });
      router.replace({ pathname: '/trip/[id]', params: { id: ride.id } });
    },
  });

  if (!pickup || !dropoff) return <Redirect href="/booking/search" />;

  const index = Math.max(0, sorted.findIndex((v) => v.id === chosenId));
  const vehicle = sorted[index];
  const estimate = estimates[index]?.data;
  const quoteError = estimates.find((e) => e.isError)?.error;

  const ownAmount = Number(ownFare);
  const usingOwn = fareMode === 'own' && !!estimate?.negotiable;
  const fare = usingOwn ? ownAmount : Number(estimate?.estimatedFare ?? 0);
  const ready =
    !!vehicle && !!estimate && (!usingOwn || ownAmount > 0) && (!later || !!when) && !request.isPending;

  const meters = route.data?.distanceMeters;
  const km = meters ? meters / 1000 : estimate?.distanceKm;
  const minutes = route.data ? Math.round(route.data.durationSeconds / 60) : estimate?.durationMinutes;

  const onRequest = () => {
    if (!ready || !vehicle) return;
    request.mutate({
      pickup: toEndpoint(pickup),
      dropoff: toEndpoint(dropoff),
      vehicleTypeId: vehicle.id,
      requestedFare: usingOwn ? ownAmount : undefined,
      scheduledFor: later && when ? when.toISOString() : undefined,
    });
  };

  const mapHeight = Math.round(height * 0.34);
  const label = vehicle
    ? `${later ? 'Schedule' : 'Request'} ${vehicle.name}${fare ? ` · ${formatTaka(fare)}` : ''}`
    : 'Choose a ride';

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <View style={{ height: mapHeight + radius.xl }}>
        <RouteMap
          pickup={coordOf(pickup)}
          dropoff={coordOf(dropoff)}
          route={route.data?.polyline.map((p) => ({ latitude: p.lat, longitude: p.lng }))}
          bottomInset={radius.xl}
        />
        <View style={[styles.back, { top: insets.top + spacing.sm }]}>
          <BackButton />
        </View>
      </View>

      <View style={styles.sheet}>
        <ScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
          <PressableScale accessibilityRole="button" style={styles.trip} onPress={() => router.back()}>
            <View style={styles.rail}>
              <View style={styles.railPickup} />
              <View style={styles.railLine} />
              <View style={styles.railDropoff} />
            </View>
            <View style={styles.tripText}>
              <Text style={styles.tripPlace} numberOfLines={1}>
                {pickup.name}
              </Text>
              <Text style={styles.tripPlace} numberOfLines={1}>
                {dropoff.name}
              </Text>
            </View>
            <Text style={styles.edit}>Edit</Text>
          </PressableScale>
          {km || minutes ? (
            <Text style={styles.tripMeta}>
              {[km ? `${km.toFixed(1)} km` : null, minutes ? `about ${minutes} min` : null]
                .filter(Boolean)
                .join(' · ')}
            </Text>
          ) : null}

          <Text style={styles.section}>Choose a ride</Text>
          {vehicles.isError ? <Notice tone="error" message={describeError(vehicles.error)} /> : null}
          {quoteError ? <Notice tone="error" message={describeError(quoteError)} /> : null}
          <View style={styles.options}>
            {sorted.map((v, i) => (
              <VehicleOption
                key={v.id}
                vehicle={v}
                estimate={estimates[i]?.data}
                loading={estimates[i]?.isPending ?? true}
                selected={i === index}
                onPress={() => setChosenId(v.id)}
              />
            ))}
          </View>

          {estimate?.negotiable ? (
            <View style={styles.card}>
              <View style={styles.cardHead}>
                <View style={styles.cardIcon}>
                  <HandCoins size={22} color={colors.brand} weight="duotone" />
                </View>
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>Your fare</Text>
                  <Text style={styles.cardBody}>Offer your own price. Drivers accept or counter.</Text>
                </View>
              </View>
              <View style={styles.segment}>
                <Segment
                  label={`Suggested ${formatTaka(estimate.estimatedFare)}`}
                  selected={fareMode === 'suggested'}
                  onPress={() => setFareMode('suggested')}
                />
                <Segment label="My own fare" selected={fareMode === 'own'} onPress={() => setFareMode('own')} />
              </View>
              {fareMode === 'own' ? (
                <View style={styles.fareInput}>
                  <Text style={styles.currency}>৳</Text>
                  <TextInput
                    value={ownFare}
                    onChangeText={(t) => setOwnFare(t.replace(/[^0-9]/g, '').slice(0, 6))}
                    placeholder={String(Math.round(Number(estimate.estimatedFare)))}
                    placeholderTextColor={colors.placeholder}
                    keyboardType="number-pad"
                    autoFocus
                    accessibilityLabel="Your fare in taka"
                    style={styles.fareText}
                  />
                </View>
              ) : null}
            </View>
          ) : estimate?.isFixedFare ? (
            <Text style={styles.note}>Fixed fare for this route, set by Al Ansar.</Text>
          ) : null}

          <Text style={styles.section}>When</Text>
          <View style={styles.segment}>
            <Segment icon="now" label="Now" selected={!later} onPress={() => setLater(false)} />
            <Segment icon="later" label="Schedule" selected={later} onPress={() => setLater(true)} />
          </View>
          {later ? (
            <View style={styles.picker}>
              <SchedulePicker value={when} onChange={setWhen} />
            </View>
          ) : null}

          {vehicle && vehicle.online_count === 0 && !later ? (
            <View style={styles.notice}>
              <Notice message={`No ${vehicle.name} drivers are online right now. You can still request and we'll keep looking.`} />
            </View>
          ) : null}
          {request.isError ? (
            <View style={styles.notice}>
              <Notice tone="error" message={describeError(request.error)} />
            </View>
          ) : null}
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          <Button label={label} disabled={!ready} loading={request.isPending} onPress={onRequest} />
        </View>
      </View>
    </View>
  );
}

function Segment({
  label,
  selected,
  onPress,
  icon,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: 'now' | 'later';
}) {
  const Icon = icon === 'now' ? Clock : icon === 'later' ? CalendarBlank : null;
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[styles.segmentItem, selected && styles.segmentSelected]}
      onPress={onPress}
    >
      {Icon ? <Icon size={16} color={selected ? colors.onPrimary : colors.text} weight="bold" /> : null}
      <Text style={[styles.segmentText, selected && styles.segmentTextSelected]} numberOfLines={1}>
        {label}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
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
  sheetContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  trip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
    padding: spacing.sm + 4,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  rail: {
    alignItems: 'center',
    paddingVertical: 6,
    alignSelf: 'stretch',
  },
  railPickup: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.brand,
  },
  railLine: {
    flex: 1,
    width: 2,
    marginVertical: 3,
    backgroundColor: colors.border,
  },
  railDropoff: {
    width: 9,
    height: 9,
    borderRadius: 2,
    backgroundColor: colors.text,
  },
  tripText: {
    flex: 1,
    gap: spacing.sm,
  },
  tripPlace: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  edit: {
    ...typography.titleSmall,
    color: colors.brandStrong,
  },
  tripMeta: {
    ...typography.caption,
    color: colors.textSubtle,
    marginTop: spacing.sm,
    marginLeft: spacing.xs,
  },
  section: {
    ...typography.headline,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  options: {
    gap: spacing.xs,
  },
  card: {
    marginTop: spacing.md,
    padding: spacing.md,
    gap: spacing.sm + 4,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.brandTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    ...typography.titleSmall,
    color: colors.text,
  },
  cardBody: {
    ...typography.caption,
    color: colors.textMuted,
  },
  segment: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  segmentItem: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  segmentSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  segmentText: {
    ...typography.titleSmall,
    color: colors.text,
  },
  segmentTextSelected: {
    color: colors.onPrimary,
  },
  fareInput: {
    height: controls.inputHeight + 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: controls.focusBorderWidth,
    borderColor: colors.brand,
    backgroundColor: colors.surface,
  },
  currency: {
    ...typography.headline,
    color: colors.text,
  },
  fareText: {
    flex: 1,
    height: '100%',
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.text,
    outlineStyle: 'solid',
    outlineWidth: 0,
  },
  note: {
    ...typography.caption,
    color: colors.textSubtle,
    marginTop: spacing.sm,
  },
  picker: {
    marginTop: spacing.sm + 4,
  },
  notice: {
    marginTop: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm + 4,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
});
