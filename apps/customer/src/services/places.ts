/**
 * Place search, behind a swappable provider.
 *
 * Bangladesh needs Google: the server's Nominatim misses misspellings and the
 * operator catalogue is sparse, while Mapbox returns almost nothing here. Two
 * backends live behind one interface:
 *
 *   - "google"  the app calls Places (New) directly with EXPO_PUBLIC_GOOGLE_MAPS_API_KEY.
 *               Fast, no backend work — the key is in the bundle, so it is kept
 *               cheap by the console's per-day caps + $1 budget.
 *   - "server"  the app calls our own API (locations/search-anywhere), which
 *               proxies to Google and keeps the key secret. The end state; not
 *               built yet.
 *
 * Switch with EXPO_PUBLIC_PLACES_PROVIDER. Callers never see which one is live:
 * they search, show the hits, and resolve the one the user taps into a Place
 * with coordinates.
 */
import { locationsApi } from '@alansar/api';

import { fromGeo, type Coord, type Place } from '@/store/booking';

/**
 * A search result row. A hit may already carry coordinates (the server returns
 * them), or only a provider id to resolve on tap (Google autocomplete returns
 * no coordinates — a Place Details call fetches them when the user picks it).
 */
export type PlaceHit = {
  /** Unique within one result set; used as a React key. */
  key: string;
  name: string;
  address: string | null;
  /** Present when the hit already has a location; null until resolved. */
  place: Place | null;
  /** Provider id to resolve coordinates on tap, when `place` is null. */
  providerId?: string;
};

export type SearchResult = {
  hits: PlaceHit[];
  /** The text that actually matched, when it differs from the query (a loosened retry). */
  matched: string;
};

export interface PlacesProvider {
  /** Autocomplete-style suggestions for a free-text query near a point. */
  search(query: string, near: Coord | null, signal?: AbortSignal): Promise<SearchResult>;
  /** Turn a hit into a Place with coordinates (a no-op when it already has them). */
  resolve(hit: PlaceHit): Promise<Place>;
}

// ---------------------------------------------------------------- Google (New)

const GOOGLE_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
const PLACES_BASE = 'https://places.googleapis.com/v1';
/** Bias/bound results to Bangladesh so BD places rank first. */
const BD_REGION = 'bd';

type AutocompleteSuggestion = {
  placePrediction?: {
    placeId: string;
    text?: { text?: string };
    structuredFormat?: {
      mainText?: { text?: string };
      secondaryText?: { text?: string };
    };
  };
};

const googleProvider: PlacesProvider = {
  async search(query, near, signal) {
    const body: Record<string, unknown> = {
      input: query,
      regionCode: BD_REGION,
      // No session token: we price each autocomplete call on its own; cheap at
      // our volume and simpler than threading tokens through the UI.
    };
    if (near) {
      body.locationBias = {
        circle: { center: { latitude: near.latitude, longitude: near.longitude }, radius: 50_000 },
      };
    }

    const res = await fetch(`${PLACES_BASE}/places:autocomplete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_KEY,
      },
      body: JSON.stringify(body),
      signal,
    });
    if (!res.ok) throw new Error(`Places autocomplete ${res.status}`);
    const data = (await res.json()) as { suggestions?: AutocompleteSuggestion[] };

    const hits: PlaceHit[] = (data.suggestions ?? [])
      .map((s) => s.placePrediction)
      .filter((p): p is NonNullable<typeof p> => !!p?.placeId)
      .map((p) => {
        const main = p.structuredFormat?.mainText?.text;
        const secondary = p.structuredFormat?.secondaryText?.text;
        return {
          key: p.placeId,
          name: main ?? p.text?.text ?? 'Unknown place',
          address: secondary ?? (main ? null : (p.text?.text ?? null)),
          place: null,
          providerId: p.placeId,
        };
      });

    return { hits, matched: query };
  },

  async resolve(hit) {
    if (hit.place) return hit.place;
    if (!hit.providerId) throw new Error('Place has no coordinates and no id to resolve');

    const res = await fetch(`${PLACES_BASE}/places/${encodeURIComponent(hit.providerId)}`, {
      headers: {
        'X-Goog-Api-Key': GOOGLE_KEY,
        // Keep the field mask tight — billed by the fields requested.
        'X-Goog-FieldMask': 'id,displayName,formattedAddress,location',
      },
    });
    if (!res.ok) throw new Error(`Place details ${res.status}`);
    const data = (await res.json()) as {
      displayName?: { text?: string };
      formattedAddress?: string;
      location?: { latitude: number; longitude: number };
    };
    if (!data.location) throw new Error('Place details returned no location');

    return {
      name: data.displayName?.text ?? hit.name,
      address: data.formattedAddress ?? hit.address,
      latitude: data.location.latitude,
      longitude: data.location.longitude,
    };
  },
};

// -------------------------------------------------------------------- server

/**
 * The server geocoder. It returns coordinates up front, and it already does the
 * "drop the last word and retry" loosening for misspellings; we pass through its
 * one-attempt result and let the caller's retry loop loosen further if needed.
 */
const serverProvider: PlacesProvider = {
  async search(query, near) {
    const results = await locationsApi.searchAnywhere(query, near ?? undefined);
    const hits: PlaceHit[] = results.map((g, i) => {
      const place = fromGeo(g);
      return {
        key: `${i}-${g.name}`,
        name: place.name,
        address: place.address,
        place,
      };
    });
    return { hits, matched: query };
  },

  async resolve(hit) {
    if (hit.place) return hit.place;
    throw new Error('Server hit is missing its coordinates');
  },
};

// --------------------------------------------------------------------- pick

const PROVIDER = process.env.EXPO_PUBLIC_PLACES_PROVIDER ?? 'server';

export const placesProvider: PlacesProvider =
  PROVIDER === 'google' && GOOGLE_KEY ? googleProvider : serverProvider;

/** True when the live provider has no coordinates until a hit is tapped. */
export const resolvesOnPick = placesProvider === googleProvider;
