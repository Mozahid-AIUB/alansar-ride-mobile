import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { notificationsApi, ridesApi, vehiclesApi, type VehicleType } from '@alansar/api';

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
