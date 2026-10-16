import { request } from './client';
import type {
  FareEstimate,
  FareOffer,
  Pagination,
  Ride,
  RideDetail,
  RouteResult,
  TripEndpoint,
  VehicleType,
} from './types';

/** TripEndpoint → the API's `pickupLocationId` or `pickupLat/Lng/Label` fields. */
const endpointFields = (side: 'pickup' | 'dropoff', endpoint: TripEndpoint) =>
  'locationId' in endpoint
    ? { [`${side}LocationId`]: endpoint.locationId }
    : {
        [`${side}Lat`]: endpoint.latitude,
        [`${side}Lng`]: endpoint.longitude,
        [`${side}Label`]: endpoint.label.slice(0, 200),
      };

export type RideRequest = {
  pickup: TripEndpoint;
  dropoff: TripEndpoint;
  vehicleTypeId: string;
  /** The passenger's own price; ignored by the API on a fixed-price route. */
  requestedFare?: number;
  notes?: string;
  /** ISO 8601 with offset; omit for a ride now. */
  scheduledFor?: string;
};

/** `/api/rides/*` — see the API's routes/ride.routes.js. */
export const ridesApi = {
  /** Newest first. The endpoint returns `{ items, pagination }` beside `success`, not under `data`. */
  history: ({ limit = 20, page = 1 }: { limit?: number; page?: number } = {}) =>
    request<{ items: Ride[]; pagination: Pagination }>(
      'GET',
      `/rides/history?limit=${limit}&page=${page}`,
      undefined,
      { auth: true, raw: true },
    ),

  estimate: (pickup: TripEndpoint, dropoff: TripEndpoint, vehicleTypeId?: string) =>
    request<FareEstimate>(
      'POST',
      '/rides/estimate',
      { ...endpointFields('pickup', pickup), ...endpointFields('dropoff', dropoff), vehicleTypeId },
      { auth: true },
    ),

  /** Road-following line for the map; `null` when no routing service answered. */
  route: (start: { latitude: number; longitude: number }, end: { latitude: number; longitude: number }) =>
    request<RouteResult | null>(
      'GET',
      `/rides/route?startLat=${start.latitude}&startLng=${start.longitude}&endLat=${end.latitude}&endLng=${end.longitude}`,
      undefined,
      { auth: true },
    ),

  request: ({ pickup, dropoff, ...rest }: RideRequest) =>
    request<RideDetail>(
      'POST',
      '/rides/request',
      { ...endpointFields('pickup', pickup), ...endpointFields('dropoff', dropoff), ...rest },
      { auth: true },
    ),

  get: (id: string) => request<RideDetail>('GET', `/rides/${id}`, undefined, { auth: true }),

  /** The ride the caller is on right now, or null. */
  active: () => request<RideDetail | null>('GET', '/rides/active', undefined, { auth: true }),

  cancel: (id: string, reason?: string) =>
    request<RideDetail>('PUT', `/rides/${id}/cancel`, { reason }, { auth: true }),

  /** Open counter-offers from drivers, cheapest first. */
  offers: (id: string) => request<FareOffer[]>('GET', `/rides/${id}/offers`, undefined, { auth: true }),

  acceptOffer: (id: string, offerId: string) =>
    request<RideDetail>('PUT', `/rides/${id}/offers/${offerId}/accept`, undefined, { auth: true }),

  declineOffer: (id: string, offerId: string) =>
    request<unknown>('PUT', `/rides/${id}/offers/${offerId}/decline`, undefined, { auth: true }),

  rate: (id: string, rating: number, review?: string) =>
    request<unknown>('POST', `/rides/${id}/rate`, { rating, review }, { auth: true }),
};

export const vehiclesApi = {
  /** Active vehicle types with how many drivers of each are free right now. */
  availability: () =>
    request<VehicleType[]>('GET', '/drivers/vehicle-types/availability', undefined, { auth: true }),
};
