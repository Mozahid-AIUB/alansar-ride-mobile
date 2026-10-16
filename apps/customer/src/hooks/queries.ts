import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  locationsApi,
  notificationsApi,
  ridesApi,
  vehiclesApi,
  type VehicleType,
} from '@alansar/api';

import { coordOf, toEndpoint, type Coord, type Place } from '@/store/booking';

/** Vehicle types with live driver counts; refreshed while the screen is open. */
export const useVehicleAvailability = () =>
  useQuery({
    queryKey: ['vehicle-types', 'availability'],
    queryFn: vehiclesApi.availability,
    refetchInterval: 30_000,
  });

/** Most drivers free first, then the operator's own order. */
export const byAvailability = (a: VehicleType, b: VehicleType) =>
  b.online_count - a.online_count || a.sort_order - b.sort_order;

export const useRideHistory = (limit = 20) =>
  useQuery({
    queryKey: ['rides', 'history', limit],
    queryFn: () => ridesApi.history({ limit }),
  });

// ------------------------------------------------------------------ booking

export const usePopularPlaces = () =>
  useQuery({ queryKey: ['locations', 'popular'], queryFn: locationsApi.popular, staleTime: 10 * 60_000 });

export const usePlaceSearch = (q: string) =>
  useQuery({
    queryKey: ['locations', 'search', q],
    queryFn: () => locationsApi.search(q),
    enabled: q.length >= 2,
    staleTime: 60_000,
  });

/** Free-text addresses. The server allows ~1 call per 2s, so no retries. */
export const useAnywhereSearch = (q: string, near: Coord | null) =>
  useQuery({
    queryKey: ['locations', 'anywhere', q, near?.latitude, near?.longitude],
    queryFn: () => locationsApi.searchAnywhere(q, near ?? undefined),
    enabled: q.length >= 3,
    staleTime: 5 * 60_000,
    retry: false,
  });

/** Road route between two points; cached for good, since roads don't move. */
export const useRoute = (from: Coord | null, to: Coord | null) =>
  useQuery({
    queryKey: ['route', from?.latitude, from?.longitude, to?.latitude, to?.longitude],
    queryFn: () => ridesApi.route(from as Coord, to as Coord),
    enabled: !!from && !!to,
    staleTime: Infinity,
    retry: false,
  });

const placeKey = (p: Place | null) => p?.locationId ?? `${p?.latitude},${p?.longitude}`;

/** A fare quote per vehicle type for this pickup → dropoff. */
export const useEstimates = (pickup: Place | null, dropoff: Place | null, vehicles: VehicleType[]) =>
  useQueries({
    queries: vehicles.map((v) => ({
      queryKey: ['estimate', placeKey(pickup), placeKey(dropoff), v.id],
      queryFn: () => ridesApi.estimate(toEndpoint(pickup as Place), toEndpoint(dropoff as Place), v.id),
      enabled: !!pickup && !!dropoff && (!!pickup.locationId || !!coordOf(pickup)),
      staleTime: 60_000,
      retry: false,
    })),
  });

// --------------------------------------------------------------------- trips

const TERMINAL = ['completed', 'cancelled'];

/** One ride, polled every 4s until it ends. */
export const useRide = (id: string) =>
  useQuery({
    queryKey: ['ride', id],
    queryFn: () => ridesApi.get(id),
    refetchInterval: (query) => (TERMINAL.includes(query.state.data?.status ?? '') ? false : 4000),
  });

export const useOffers = (id: string, enabled: boolean) =>
  useQuery({
    queryKey: ['ride', id, 'offers'],
    queryFn: () => ridesApi.offers(id),
    enabled,
    refetchInterval: enabled ? 4000 : false,
  });

export const useActiveRide = () =>
  useQuery({ queryKey: ['ride', 'active'], queryFn: ridesApi.active, refetchInterval: 15_000 });

/** After anything that changes a ride, refresh every view of rides. */
export const useInvalidateRides = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ predicate: (q) => ['ride', 'rides'].includes(String(q.queryKey[0])) });
};

// ------------------------------------------------------------- notifications

export const useUnreadCount = () =>
  useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: notificationsApi.unreadCount,
    refetchInterval: 30_000,
  });

export const useNotifications = () =>
  useQuery({
    queryKey: ['notifications', 'list'],
    queryFn: () => notificationsApi.list({ limit: 30 }),
  });

const useNotificationMutation = <T>(mutationFn: (arg: T) => Promise<unknown>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
};

export const useMarkRead = () => useNotificationMutation(notificationsApi.markRead);
export const useMarkAllRead = () => useNotificationMutation(notificationsApi.markAllRead);
