import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CalendarBlank, CaretRight } from 'phosphor-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { describeError } from '@alansar/api';
import { lightTheme } from '@alansar/theme';

import { Notice } from '@/components/Notice';
import { PressableScale } from '@/components/PressableScale';
import { byAvailability, useVehicleAvailability } from '@/hooks/queries';
import { startBooking } from '@/store/booking';

import { VehicleCard, VehicleCardSkeleton } from '../home/VehicleCard';

const { colors, spacing, radius, typography, shadows } = lightTheme;

const GAP = spacing.sm + 4;

const enter = (delay: number) => FadeInDown.delay(delay).duration(420);

/** Every vehicle type the operator runs, with live driver counts, plus booking ahead. */
export function ServicesScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const vehicles = useVehicleAvailability();

  const tileWidth = (width - spacing.lg * 2 - GAP) / 2;
  const sorted = vehicles.data ? [...vehicles.data].sort(byAvailability) : null;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + spacing.md }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Services</Text>
        <Text style={styles.subtitle}>Go anywhere, the way you like.</Text>

        <Animated.View entering={enter(0)}>
          <Text style={styles.section}>Rides</Text>
          {vehicles.isError ? (
            <Notice tone="error" message={describeError(vehicles.error)} />
          ) : (
            <View style={styles.grid}>
              {sorted
                ? sorted.map((v) => (
                    <VehicleCard
                      key={v.id}
                      vehicle={v}
                      style={{ width: tileWidth }}
                      artWidth={Math.min(120, tileWidth - 40)}
                      onPress={() => startBooking({ vehicleTypeId: v.id })}
                    />
                  ))
                : [0, 1, 2, 3].map((i) => (
                    <VehicleCardSkeleton key={i} style={{ width: tileWidth }} />
                  ))}
            </View>
          )}
        </Animated.View>

        <Animated.View entering={enter(80)}>
          <Text style={styles.section}>Plan ahead</Text>
          <PressableScale
            accessibilityRole="button"
            style={styles.schedule}
            onPress={() => startBooking({ scheduling: true })}
          >
            <View style={styles.scheduleIcon}>
              <CalendarBlank size={26} color={colors.brand} weight="duotone" />
            </View>
            <View style={styles.scheduleText}>
              <Text style={styles.scheduleTitle}>Schedule a ride</Text>
              <Text style={styles.scheduleBody}>
                Book for later. We find your driver ahead of time.
              </Text>
            </View>
            <CaretRight size={18} color={colors.textSubtle} weight="bold" />
          </PressableScale>
        </Animated.View>
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
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  title: {
    ...typography.headlineLarge,
    color: colors.text,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: 2,
  },
  section: {
    ...typography.headline,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm + 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  schedule: {
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
  scheduleIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.brandTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleText: {
    flex: 1,
  },
  scheduleTitle: {
    ...typography.title,
    color: colors.text,
  },
  scheduleBody: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: 2,
  },
});
