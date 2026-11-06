import { useSyncExternalStore } from 'react';

import { driversApi } from '@alansar/api';
import { session } from '@alansar/auth';

/**
 * Whether the driver is online (visible to riders, receiving requests) or
 * offline. The toggle calls the API so dispatch actually starts/stops offering
 * this driver rides; the local flag is corrected from the server's reply.
 */
let online = false;
let busy = false;
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((l) => l());

const driverId = () => {
  const state = session.getState();
  return state.status === 'signedIn' ? state.user.id : null;
};

export const driverStatus = {
  get: () => online,
  isBusy: () => busy,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  /** Flip online/offline through the API; reverts on failure. */
  toggle: async () => {
    const id = driverId();
    if (!id || busy) return;
    const next = !online;
    busy = true;
    // Optimistic: move the switch now, correct it from the server.
    online = next;
    notify();
    try {
      const res = await driversApi.setStatus(id, next);
      online = res.is_online ?? next;
    } catch {
      online = !next; // put it back
    } finally {
      busy = false;
      notify();
    }
  },
};

export const useDriverOnline = () =>
  useSyncExternalStore(driverStatus.subscribe, driverStatus.get, driverStatus.get);
