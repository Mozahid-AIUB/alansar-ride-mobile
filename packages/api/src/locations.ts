import { request } from './client';
import type { CatalogueLocation, GeoResult } from './types';

/** `/api/locations/*` — see the API's routes/location.routes.js. */
export const locationsApi = {
  /** The operator's curated places, matched on name with typo tolerance. */
  search: (q: string, limit = 8) =>
    request<CatalogueLocation[]>('GET', `/locations/search?q=${encodeURIComponent(q)}&limit=${limit}`, undefined, {
      auth: true,
    }),

  popular: () => request<CatalogueLocation[]>('GET', '/locations/popular', undefined, { auth: true }),

  /** Any address, via the server's geocoder. Throttled server-side to ~1 call / 2s. */
  searchAnywhere: (q: string, near?: { latitude: number; longitude: number }) =>
    request<GeoResult[]>(
      'GET',
      `/locations/search-anywhere?q=${encodeURIComponent(q)}&limit=5${
        near ? `&nearLat=${near.latitude}&nearLng=${near.longitude}` : ''
      }`,
      undefined,
      { auth: true },
    ),

  /** Coordinates → a short label, or null when the geocoder has nothing. */
  reverse: async (latitude: number, longitude: number) =>
    (
      await request<{ label: string | null }>(
        'GET',
        `/locations/reverse?latitude=${latitude}&longitude=${longitude}`,
        undefined,
        { auth: true },
      )
    ).label,
};
