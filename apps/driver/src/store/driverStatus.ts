import { useSyncExternalStore } from 'react';

/**
 * Whether the driver is online (visible to riders, receiving requests) or
 * offline. Lives in memory for now; a later version syncs this to the API and
 * starts/stops location updates over the socket.
 */
let online = false;
const listeners = new Set<() => void>();

export const driverStatus = {
  get: () => online,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  set: (next: boolean) => {
    online = next;
    listeners.forEach((l) => l());
    // TODO: POST the status to the API and begin/stop socket location updates.
  },
  toggle: () => driverStatus.set(!online),
};

export const useDriverOnline = () =>
  useSyncExternalStore(driverStatus.subscribe, driverStatus.get, driverStatus.get);
