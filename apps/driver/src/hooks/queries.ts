import { useQuery } from '@tanstack/react-query';

import { driversApi } from '@alansar/api';
import { session } from '@alansar/auth';

const driverId = () => {
  const state = session.getState();
  return state.status === 'signedIn' ? state.user.id : null;
};

/** The driver's own profile. */
export const useDriverProfile = () =>
  useQuery({ queryKey: ['driver', 'me'], queryFn: driversApi.me });

/** Today's and lifetime earnings; refreshed while Home is open. */
export const useDriverEarnings = () => {
  const id = driverId();
  return useQuery({
    queryKey: ['driver', 'earnings', id],
    queryFn: () => driversApi.earnings(id as string),
    enabled: !!id,
    refetchInterval: 60_000,
  });
};

/** Ride requests this driver can offer on; polled while online. */
export const useAvailableRides = (enabled: boolean) =>
  useQuery({
    queryKey: ['driver', 'available-rides'],
    queryFn: driversApi.availableRides,
    enabled,
    refetchInterval: enabled ? 5_000 : false,
  });
