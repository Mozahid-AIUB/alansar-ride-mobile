/**
 * The free map: OpenStreetMap's own standard tiles. No API key. OSM's tile
 * policy allows light use with attribution, not heavy production traffic: before
 * launch, point EXPO_PUBLIC_FREE_MAP_TILES (and _NATIVE) at a keyed OSM provider
 * such as MapTiler or Stadia (both have free tiers) without touching code.
 */
const OSM_TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

export const FREE_TILES = {
  /** Leaflet template. */
  web: process.env.EXPO_PUBLIC_FREE_MAP_TILES ?? OSM_TILES,
  /** react-native-maps UrlTile template. */
  native: process.env.EXPO_PUBLIC_FREE_MAP_TILES_NATIVE ?? process.env.EXPO_PUBLIC_FREE_MAP_TILES ?? OSM_TILES,
  tileSize: Number(process.env.EXPO_PUBLIC_FREE_MAP_TILE_SIZE ?? 256),
  attribution: process.env.EXPO_PUBLIC_FREE_MAP_ATTRIBUTION ?? '© OpenStreetMap contributors',
  maxZoom: 19,
};

/** Dhaka, until the first pin arrives. */
export const DEFAULT_CENTER = { latitude: 23.7808, longitude: 90.4093 };
