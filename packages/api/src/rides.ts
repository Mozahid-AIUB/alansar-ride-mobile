import { request } from './client';
import type {
  DriverEarnings,
  DriverProfile,
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

/** `/api/drivers/*` and the driver side of `/api/rides/*` — see driver.routes.js / ride.routes.js. */
export const driversApi = {
  /** The signed-in driver's own profile. */
  me: () => request<DriverProfile>('GET', '/drivers/me', undefined, { auth: true }),

  /** Go online (offered rides) or offline. */
  setStatus: (driverId: string, online: boolean) =>
    request<{ status: string }>('PUT', `/drivers/${driverId}/status`, { online }, { auth: true }),

  /** Report the driver's current position (no map; coordinates only). */
  updateLocation: (driverId: string, latitude: number, longitude: number) =>
    request<unknown>('PUT', `/drivers/${driverId}/location`, { latitude, longitude }, { auth: true }),

  /** Today's and lifetime earnings for the driver. */
  earnings: (driverId: string) =>
    request<DriverEarnings>('GET', `/drivers/${driverId}/earnings`, undefined, { auth: true }),

  /** Ride requests this driver can offer on right now. */
  availableRides: () => request<RideDetail[]>('GET', '/rides/available', undefined, { auth: true }),

  /** Offer a fare on a request (the driver's price; the rider accepts or counters). */
  makeOffer: (rideId: string, amount: number, note?: string) =>
    request<FareOffer>('POST', `/rides/${rideId}/offers`, { amount, note }, { auth: true }),

  /** The offers this driver has made on a ride. */
  myOffers: (rideId: string) =>
    request<FareOffer[]>('GET', `/rides/${rideId}/offers/mine`, undefined, { auth: true }),

  /** Trip lifecycle, once the driver is assigned. */
  arrive: (rideId: string) => request<RideDetail>('PUT', `/rides/${rideId}/arrive`, undefined, { auth: true }),
  start: (rideId: string) => request<RideDetail>('PUT', `/rides/${rideId}/start`, undefined, { auth: true }),
  complete: (rideId: string, finalFare?: number) =>
    request<RideDetail>('PUT', `/rides/${rideId}/complete`, finalFare ? { finalFare } : undefined, { auth: true }),
};
