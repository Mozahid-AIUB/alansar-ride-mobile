import { request } from './client';
import type { AppNotification, Pagination } from './types';

/** `/api/notifications/*` — see the API's routes/notification.routes.js. */
export const notificationsApi = {
  /** Newest first. Returns `{ items, pagination }` beside `success`, not under `data`. */
  list: ({ limit = 30 }: { limit?: number } = {}) =>
    request<{ items: AppNotification[]; pagination: Pagination }>(
      'GET',
      `/notifications?limit=${limit}`,
      undefined,
      { auth: true, raw: true },
    ),

  unreadCount: async () =>
    (await request<{ count: number }>('GET', '/notifications/unread-count', undefined, { auth: true }))
      .count,

  markRead: (id: string) =>
    request<{ id: string; is_read: boolean }>('PUT', `/notifications/${id}/read`, undefined, {
      auth: true,
    }),

  markAllRead: () =>
    request<{ updated: number }>('PUT', '/notifications/read-all', undefined, { auth: true }),
};
