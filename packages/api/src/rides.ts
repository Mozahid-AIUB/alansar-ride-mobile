import { request } from './client';
import type { Pagination, Ride, VehicleType } from './types';

export const ridesApi = {
  /** Newest first. The endpoint returns `{ items, pagination }` beside `success`, not under `data`. */
  history: ({ limit = 20, page = 1 }: { limit?: number; page?: number } = {}) =>
    request<{ items: Ride[]; pagination: Pagination }>(
      'GET',
      `/rides/history?limit=${limit}&page=${page}`,
      undefined,
      { auth: true, raw: true },
    ),
};

export const vehiclesApi = {
  /** Active vehicle types with how many drivers of each are free right now. */
  availability: () =>
    request<VehicleType[]>('GET', '/drivers/vehicle-types/availability', undefined, { auth: true }),
};
