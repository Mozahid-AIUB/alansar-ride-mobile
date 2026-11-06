import * as Location from 'expo-location';

import { locationsApi } from '@alansar/api';

import type { Coord, Place } from '@/store/booking';

const TIMEOUT_MS = 10_000;

const withTimeout = <T>(promise: Promise<T>) =>
  Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS)),
  ]);

/**
 * Where the phone is, labelled by the server's reverse geocoder. Null when the
 * user declines location access or no fix arrives in time; the search screen
 * then simply asks them to type a pickup.
 */
export async function currentPlace(): Promise<Place | null> {
  const here = await currentCoord();
  if (!here) return null;
  const { latitude, longitude } = here;

  let label: string | null = null;
  try {
    label = await locationsApi.reverse(latitude, longitude);
  } catch {
    // Throttled or the geocoder is down: the coordinate alone still books fine.
  }

  return {
    name: label ?? 'Current location',
    address: label ? 'Your current location' : null,
    latitude,
    longitude,
  };
}

/** Where the phone is, unlabelled; null when location is off or slow. */
export async function currentCoord(): Promise<Coord | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return null;
    const position = await withTimeout(
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
    );
    return { latitude: position.coords.latitude, longitude: position.coords.longitude };
  } catch {
    return null;
  }
}
