import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { describeError } from '@alansar/api';
import { lightTheme } from '@alansar/theme';

import { Button } from '@/components/Button';
import { VehicleArt } from '@/components/illustrations/VehicleArt';
import { Notice } from '@/components/Notice';
import { PressableScale } from '@/components/PressableScale';
import { useRideHistory } from '@/hooks/queries';
import { RideRow } from '@/features/rides/RideRow';
import { startBooking } from '@/store/booking';

const { colors, spacing, radius, typography, shadows } = lightTheme;

/** Every trip, newest first, from GET /api/rides/history. */
export function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const history = useRideHistory(20);
  const rides = history.data?.items ?? [];

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.md }]}>
      <StatusBar style="dark" />
      <Text style={styles.title}>Activity</Text>
      <Text style={styles.subtitle}>
        {history.data
          ? `${history.data.pagination.total} ride${history.data.pagination.total === 1 ? '' : 's'}`
          : 'Your trips'}
      </Text>

      {history.isError ? (
        <View style={styles.pad}>
          <Notice tone="error" message={describeError(history.error)} />
        </View>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(ride) => ride.id}
          renderItem={({ item }) => (
            <PressableScale
              accessibilityRole="button"
              haptic={false}
              onPress={() => router.push({ pathname: '/trip/[id]', params: { id: item.id } })}
            >
              <RideRow ride={item} />
            </PressableScale>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={rides.length ? styles.list : styles.listEmpty}
          refreshControl={
            <RefreshControl
              refreshing={history.isRefetching}
              onRefresh={() => void history.refetch()}
              tintColor={colors.brand}
            />
          }
          ListEmptyComponent={
            history.isPending ? (
              <Text style={styles.muted}>Loading your rides…</Text>
            ) : (
              <View style={styles.empty}>
                <View style={styles.emptyArt}>
                  <VehicleArt slug="auto" width={110} />
                </View>
                <Text style={styles.emptyTitle}>No rides yet</Text>
                <Text style={styles.emptyBody}>
                  When you take a trip, its route, fare and receipt live here.
                </Text>
                <View style={styles.emptyAction}>
                  <Button label="Book a ride" onPress={() => startBooking()} />
                </View>
              </View>
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.headlineLarge,
    color: colors.text,
    paddingHorizontal: spacing.lg,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
    paddingHorizontal: spacing.lg,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  pad: {
    paddingHorizontal: spacing.lg,
  },
  list: {
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    boxShadow: shadows.card,
  },
  listEmpty: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    justifyContent: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderSubtle,
  },
  muted: {
    ...typography.bodySmall,
    color: colors.textSubtle,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyArt: {
    width: 150,
    height: 90,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    boxShadow: shadows.card,
  },
  emptyTitle: {
    ...typography.headline,
    color: colors.text,
  },
  emptyBody: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
    maxWidth: 260,
  },
  emptyAction: {
    alignSelf: 'stretch',
    marginTop: spacing.lg,
  },
});
