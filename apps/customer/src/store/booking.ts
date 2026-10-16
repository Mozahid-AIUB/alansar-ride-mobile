import { useSyncExternalStore } from 'react';
import { router } from 'expo-router';

import type { CatalogueLocation, GeoResult, TripEndpoint } from '@alansar/api';

/** A pickup or destination as the booking screens hold it. */
export type Place = {
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  /** Set for the operator's catalogue places; the API then prices by route. */
  locationId?: string;
};

export type Coord = { latitude: number; longitude: number };

type BookingState = {
  pickup: Place | null;
  dropoff: Place | null;
  /** Chosen on Home or Services before the destination. */
  vehicleTypeId: string | null;
  /** Opened from a Schedule button, so the review screen starts on "Later". */
  scheduling: boolean;
};

const initial: BookingState = { pickup: null, dropoff: null, vehicleTypeId: null, scheduling: false };

let state = initial;
const listeners = new Set<() => void>();

/** The trip being put together across Search → Review. Lives only in memory. */
export const booking = {
  get: () => state,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  set: (patch: Partial<BookingState>) => {
    state = { ...state, ...patch };
    listeners.forEach((listener) => listener());
  },
};

export const useBooking = () => useSyncExternalStore(booking.subscribe, booking.get, booking.get);

/** Start a fresh booking (pickup is kept) and open the search screen. */
export function startBooking(options: { vehicleTypeId?: string; scheduling?: boolean } = {}) {
  booking.set({
    dropoff: null,
    vehicleTypeId: options.vehicleTypeId ?? null,
    scheduling: options.scheduling ?? false,
  });
  router.push('/booking/search');
}

const num = (v: string | number | null) => (v === null || v === '' ? null : Number(v));

export const fromCatalogue = (l: CatalogueLocation): Place => ({
  name: l.name,
  address: [l.area, l.city].filter(Boolean).join(', ') || l.address,
  latitude: num(l.latitude),
  longitude: num(l.longitude),
  locationId: l.id,
});

export const fromGeo = (g: GeoResult): Place => ({
  name: g.name,
  address: g.address,
  latitude: g.latitude,
  longitude: g.longitude,
});

export const coordOf = (p: Place | null | undefined): Coord | null =>
  p && p.latitude !== null && p.longitude !== null ? { latitude: p.latitude, longitude: p.longitude } : null;

/** Catalogue id when there is one (so admin route prices apply), else the coordinate. */
export const toEndpoint = (p: Place): TripEndpoint =>
  p.locationId
    ? { locationId: p.locationId }
    : { latitude: p.latitude ?? 0, longitude: p.longitude ?? 0, label: p.name };
