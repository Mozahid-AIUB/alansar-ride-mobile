import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { NavigationArrow } from 'phosphor-react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useT } from '@alansar/i18n';
import { lightTheme, palette } from '@alansar/theme';

import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/Button';
import { DEFAULT_CENTER } from '@/components/map/mapConfig';
import { PickMap, type PickMapHandle } from '@/components/map/PickMap';
import { PressableScale } from '@/components/PressableScale';
import { useReverseGeocode } from '@/hooks/queries';
import { useDebounced } from '@/hooks/useDebounced';
import { currentCoord } from '@/services/location';
import { booking, coordOf, type Coord, type Place } from '@/store/booking';

const { colors, spacing, radius, typography, shadows } = lightTheme;

const SPRING = { damping: 16, stiffness: 260 };
/** ~1 m: finer moves reuse the same address. */
const round = (n: number) => Math.round(n * 1e5) / 1e5;

/**
 * "Set on map": drag the map under a fixed pin when search can't find the
 * place. Opened as /booking/pick?field=pickup|dropoff.
 */
export function PickOnMapScreen() {
  const insets = useSafeAreaInsets();
  const t = useT();
  const { field: fieldParam } = useLocalSearchParams<{ field?: string }>();
  const field = fieldParam === 'pickup' ? 'pickup' : 'dropoff';

  const [initial] = useState<Coord | null>(() => {
    const { pickup, dropoff } = booking.get();
    return coordOf(field === 'pickup' ? pickup : dropoff) ?? coordOf(pickup);
  });
  const [center, setCenter] = useState<Coord>(initial ?? DEFAULT_CENTER);
  const [moving, setMoving] = useState(false);
  const map = useRef<PickMapHandle>(null);

  // Ask the geocoder only once the pin has rested a moment (it allows ~1 call per 2s).
  const spot = `${round(center.latitude)},${round(center.longitude)}`;
  const settled = useDebounced(moving ? null : spot, 500);
  const at = settled === spot && !moving ? { latitude: round(center.latitude), longitude: round(center.longitude) } : null;
  const reverse = useReverseGeocode(at);
  const label = at ? reverse.data : undefined;
  const resolving = moving || !at || reverse.isFetching;

  const goToMe = async () => {
    const here = await currentCoord();
    if (here) map.current?.moveTo(here);
  };

  // Nothing to start from: open on where the phone is.
  useEffect(() => {
    if (!initial) void goToMe();
  }, []);

  const lift = useSharedValue(0);
  useEffect(() => {
    lift.set(withSpring(moving ? 1 : 0, SPRING));
  }, [moving, lift]);
  const pinStyle = useAnimatedStyle(() => ({ transform: [{ translateY: -12 * lift.get() }] }));
  const shadowStyle = useAnimatedStyle(() => ({
    opacity: 0.35 - 0.15 * lift.get(),
    transform: [{ scale: 1 - 0.3 * lift.get() }],
  }));

  const confirm = () => {
    const coord = { latitude: round(center.latitude), longitude: round(center.longitude) };
    const place: Place = {
      name: label ?? 'Pinned location',
      address: label ? 'Pinned on the map' : `${coord.latitude.toFixed(5)}, ${coord.longitude.toFixed(5)}`,
      ...coord,
    };
    booking.set(field === 'pickup' ? { pickup: place } : { dropoff: place });
    const { pickup, dropoff } = booking.get();
    // Both ends set: straight on to the rides, with search still behind for "Edit".
    if (pickup && dropoff) router.replace('/booking/review');
    else router.back();
  };

  const title = field === 'pickup' ? t('pick.setPickup') : t('pick.setDestination');

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <View style={styles.mapArea}>
        <PickMap
          ref={map}
          initial={initial ?? DEFAULT_CENTER}
          onMoveStart={() => setMoving(true)}
          onMoveEnd={(c) => {
            setMoving(false);
            setCenter(c);
          }}
        />

        {/* The pin's tip marks the map centre. */}
        <View style={styles.pinLayer} pointerEvents="none">
          <Animated.View style={[styles.groundShadow, shadowStyle]} />
          <Animated.View style={[styles.pin, pinStyle]}>
            <View style={[styles.pinHead, field === 'pickup' ? styles.pinHeadPickup : styles.pinHeadDropoff]}>
              <View style={field === 'pickup' ? styles.pinDot : styles.pinSquare} />
            </View>
            <View style={styles.pinStem} />
          </Animated.View>
        </View>

        <View style={[styles.back, { top: insets.top + spacing.sm }]}>
          <BackButton />
        </View>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Go to my location"
          style={styles.locate}
          onPress={() => void goToMe()}
        >
          <NavigationArrow size={20} color={colors.text} weight="fill" />
        </PressableScale>
      </View>

      <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.hint}>{t('pick.dragPin')}</Text>
        <View style={styles.address}>
          <View style={[styles.addressMark, field === 'pickup' ? styles.markPickup : styles.markDropoff]} />
          <Text style={[styles.addressText, resolving && styles.addressPending]} numberOfLines={2}>
            {resolving ? 'Finding the address…' : (label ?? 'Pinned location (no street name here)')}
          </Text>
        </View>
        <Button label={field === 'pickup' ? t('pick.confirmPickup') : t('pick.confirmDestination')} disabled={resolving} onPress={confirm} />
      </View>
    </View>
  );
}

const PIN_HEAD = 34;
const PIN_STEM = 14;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  mapArea: {
    flex: 1,
  },
  pinLayer: {
    ...StyleSheet.absoluteFill,
  },
  pin: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: PIN_HEAD,
    alignItems: 'center',
    // The stem's tip, not the pin's middle, sits on the centre.
    marginTop: -(PIN_HEAD + PIN_STEM),
    marginLeft: -PIN_HEAD / 2,
  },
  pinHead: {
    width: PIN_HEAD,
    height: PIN_HEAD,
    borderRadius: PIN_HEAD / 2,
    borderWidth: 3,
    borderColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.raised,
  },
  pinHeadPickup: {
    backgroundColor: colors.brand,
  },
  pinHeadDropoff: {
    backgroundColor: palette.ink900,
  },
  pinDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: palette.white,
  },
  pinSquare: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: palette.white,
  },
  pinStem: {
    width: 3,
    height: PIN_STEM,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    backgroundColor: palette.ink900,
  },
  groundShadow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -2.5,
    marginLeft: -6,
    width: 12,
    height: 5,
    borderRadius: 6,
    backgroundColor: palette.ink900,
  },
  back: {
    position: 'absolute',
    left: spacing.lg,
  },
  locate: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.raised,
  },
  sheet: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    marginTop: -radius.xl,
    backgroundColor: colors.surface,
    boxShadow: shadows.raised,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  hint: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  address: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
    minHeight: 56,
    marginVertical: spacing.sm,
    padding: spacing.sm + 4,
    borderRadius: radius.md,
    backgroundColor: colors.inputFill,
  },
  addressMark: {
    width: 10,
    height: 10,
  },
  markPickup: {
    borderRadius: 5,
    backgroundColor: colors.brand,
  },
  markDropoff: {
    borderRadius: 2,
    backgroundColor: colors.text,
  },
  addressText: {
    ...typography.bodyStrong,
    flex: 1,
    color: colors.text,
  },
  addressPending: {
    color: colors.textSubtle,
  },
});
