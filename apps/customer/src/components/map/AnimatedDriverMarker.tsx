import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { AnimatedRegion, MarkerAnimated } from 'react-native-maps';

import type { Coord } from '@/store/booking';

import { DriverPin } from './Pins';

/** How long the marker takes to glide from the old fix to the new one. */
const SLIDE_MS = 1_000;

/**
 * The driver marker, gliding between position updates instead of jumping.
 *
 * The ride is polled every few seconds, so a plain Marker would teleport the car
 * on each update. An AnimatedRegion tweens the coordinate on the native thread,
 * so the car slides smoothly — the Uber feel — at no JS cost per frame.
 */
export function AnimatedDriverMarker({ coordinate }: { coordinate: Coord }) {
  // Seed the animated region once; later updates animate towards the new fix.
  const region = useRef(
    new AnimatedRegion({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      latitudeDelta: 0,
      longitudeDelta: 0,
    }),
  ).current;

  useEffect(() => {
    const next = { latitude: coordinate.latitude, longitude: coordinate.longitude };
    // timing() drives the move on the native side (useNativeDriver on Android).
    region
      .timing({ ...next, duration: SLIDE_MS, useNativeDriver: Platform.OS === 'android' } as never)
      .start();
  }, [coordinate.latitude, coordinate.longitude, region]);

  return (
    <MarkerAnimated coordinate={region as never} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
      <DriverPin />
    </MarkerAnimated>
  );
}
