import { useQuery } from '@tanstack/react-query';

import { ridesApi, vehiclesApi } from '@alansar/api';

/** Vehicle types with live driver counts; refreshed while the screen is open. */
export const useVehicleAvailability = () =>
  useQuery({
    queryKey: ['vehicle-types', 'availability'],
    queryFn: vehiclesApi.availability,
    refetchInterval: 30_000,
  });

export const useRideHistory = (limit = 20) =>
  useQuery({
    queryKey: ['rides', 'history', limit],
    queryFn: () => ridesApi.history({ limit }),
  });
