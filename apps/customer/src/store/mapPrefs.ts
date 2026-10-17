import { useSyncExternalStore } from 'react';

import { secureStorage } from '@/services/storage';

/**
 * Which map the passenger sees. `google`: Google Maps on Android (Apple Maps on
 * iOS, the platform default). `mapbox`: Mapbox tiles, no Google at all.
 * The browser preview always draws Mapbox tiles; Google's web map needs a paid key.
 */
export type MapProvider = 'google' | 'mapbox';

const KEY = 'alansar.mapProvider';

let provider: MapProvider = 'google';
const listeners = new Set<() => void>();

export const mapPrefs = {
  get: () => provider,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  set: (next: MapProvider) => {
    provider = next;
    listeners.forEach((listener) => listener());
    void secureStorage.set(KEY, next);
  },
  /** Read the saved choice once at start-up. */
  restore: async () => {
    const saved = await secureStorage.get(KEY);
    // 'free' was the OpenStreetMap option before Mapbox replaced it.
    const value = saved === 'free' ? 'mapbox' : saved;
    if (value === 'google' || value === 'mapbox') {
      provider = value;
      listeners.forEach((listener) => listener());
    }
  },
};

export const useMapProvider = () => useSyncExternalStore(mapPrefs.subscribe, mapPrefs.get, mapPrefs.get);
