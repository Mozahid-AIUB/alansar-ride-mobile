import { useSyncExternalStore } from 'react';

import { secureStorage } from '@/services/storage';

/**
 * Which map the passenger sees. `google`: Google Maps on Android (Apple Maps on
 * iOS, the platform default). `free`: OpenStreetMap tiles, no Google at all.
 * The browser preview always uses the free map; Google's web map needs a paid key.
 */
export type MapProvider = 'google' | 'free';

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
    if (saved === 'google' || saved === 'free') {
      provider = saved;
      listeners.forEach((listener) => listener());
    }
  },
};

export const useMapProvider = () => useSyncExternalStore(mapPrefs.subscribe, mapPrefs.get, mapPrefs.get);
