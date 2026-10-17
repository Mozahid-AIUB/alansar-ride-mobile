/**
 * Map tile sources for the non-Google map.
 *
 * Mapbox: raster tiles from the Styles API, so react-native-maps (phones) and
 * Leaflet (browser) can both draw them without Mapbox's native SDK. 512px tiles
 * because Mapbox bills per tile request and 256px needs four times as many.
 * Needs EXPO_PUBLIC_MAPBOX_TOKEN, a public `pk.` token (restrict it to the app's
 * URLs in the Mapbox dashboard).
 *
 * Without a token the map falls back to OpenStreetMap's own tile server, which
 * is fine for development but not meant for production traffic.
 */
export type TileSource = {
  url: string;
  tileSize: number;
  attribution: string;
  maxZoom: number;
};

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;
const MAPBOX_STYLE = process.env.EXPO_PUBLIC_MAPBOX_STYLE ?? 'mapbox/streets-v12';

export const hasMapboxToken = !!MAPBOX_TOKEN;

const MAPBOX_TILES: TileSource | null = MAPBOX_TOKEN
  ? {
      url: `https://api.mapbox.com/styles/v1/${MAPBOX_STYLE}/tiles/512/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`,
      tileSize: 512,
      attribution: '© Mapbox © OpenStreetMap',
      maxZoom: 20,
    }
  : null;

const OSM_TILES: TileSource = {
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  tileSize: 256,
  attribution: '© OpenStreetMap contributors',
  maxZoom: 19,
};

/** Mapbox when a token is configured, otherwise OpenStreetMap's own server. */
export const OPEN_TILES: TileSource = MAPBOX_TILES ?? OSM_TILES;

/** Dhaka, until the first pin arrives. */
export const DEFAULT_CENTER = { latitude: 23.7808, longitude: 90.4093 };
