import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { palette } from '@alansar/theme';

import type { Coord } from '@/store/booking';

import { DEFAULT_CENTER, OPEN_TILES } from './mapConfig';
import type { RouteMapProps } from './RouteMap';

/** Brand pins as Leaflet div icons (plain HTML, so no marker images to bundle). */
const pin = (html: string, size: number) =>
  L.divIcon({ html, className: '', iconSize: [size, size], iconAnchor: [size / 2, size / 2] });

const PICKUP = pin(
  `<div style="width:26px;height:26px;border-radius:13px;background:rgba(35,150,58,.22);display:flex;align-items:center;justify-content:center">
     <div style="width:14px;height:14px;border-radius:7px;border:3px solid #fff;background:${palette.green500};box-sizing:border-box"></div>
   </div>`,
  26,
);
const DROPOFF = pin(
  `<div style="width:22px;height:22px;border-radius:4px;background:${palette.ink900};display:flex;align-items:center;justify-content:center">
     <div style="width:8px;height:8px;border-radius:1.5px;background:#fff"></div>
   </div>`,
  22,
);
const DRIVER = pin(
  `<div style="width:34px;height:34px;border-radius:17px;border:3px solid #fff;background:${palette.ink900};box-sizing:border-box;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.3)">
     <svg width="16" height="16" viewBox="0 0 256 256" fill="#fff"><path d="M240 104h-9.8L192.6 52.7A16 16 0 0 0 179.9 48H76.1a16 16 0 0 0-12.7 4.7L25.8 104H16a8 8 0 0 0 0 16h8v80a16 16 0 0 0 16 16h24a16 16 0 0 0 16-16v-16h96v16a16 16 0 0 0 16 16h24a16 16 0 0 0 16-16v-80h8a8 8 0 0 0 0-16Z"/></svg>
   </div>`,
  34,
);

const toLatLng = (c: Coord): L.LatLngTuple => [c.latitude, c.longitude];

/**
 * Browser map: Leaflet with Mapbox tiles (OpenStreetMap until a token is set).
 * react-native-maps has no web build, and Google's web map needs a paid key, so
 * the browser always shows these tiles — the same route, pins and driver as the phone.
 */
export function RouteMap({ pickup, dropoff, route, driver, bottomInset = 0, interactive = true }: RouteMapProps) {
  const host = useRef<View>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);

  // Create the map once.
  useEffect(() => {
    const el = host.current as unknown as HTMLElement | null;
    if (!el || map.current) return;
    const m = L.map(el, {
      zoomControl: false,
      attributionControl: true,
      dragging: interactive,
      scrollWheelZoom: interactive,
      doubleClickZoom: interactive,
      touchZoom: interactive,
      boxZoom: interactive,
      keyboard: interactive,
    }).setView(toLatLng(DEFAULT_CENTER), 12);
    L.tileLayer(OPEN_TILES.url, {
      maxZoom: OPEN_TILES.maxZoom,
      attribution: OPEN_TILES.attribution,
      tileSize: OPEN_TILES.tileSize,
      zoomOffset: OPEN_TILES.tileSize === 512 ? -1 : 0,
    }).addTo(m);
    m.attributionControl.setPrefix(false);
    layer.current = L.layerGroup().addTo(m);
    map.current = m;

    // Leaflet measures its box once; keep it right when the screen resizes.
    const observer = new ResizeObserver(() => m.invalidateSize());
    observer.observe(el);
    return () => {
      observer.disconnect();
      m.remove();
      map.current = null;
    };
  }, [interactive]);

  const line = route?.length ? route : pickup && dropoff ? [pickup, dropoff] : null;
  const key = JSON.stringify([pickup, dropoff, driver, route?.length, bottomInset]);

  // Redraw the route and pins whenever they change.
  useEffect(() => {
    const m = map.current;
    const g = layer.current;
    if (!m || !g) return;
    g.clearLayers();

    if (line) {
      L.polyline(line.map(toLatLng), {
        color: palette.ink900,
        weight: route?.length ? 5 : 3,
        dashArray: route?.length ? undefined : '8 8',
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(g);
    }
    if (pickup) L.marker(toLatLng(pickup), { icon: PICKUP, interactive: false }).addTo(g);
    if (dropoff) L.marker(toLatLng(dropoff), { icon: DROPOFF, interactive: false }).addTo(g);
    if (driver) L.marker(toLatLng(driver), { icon: DRIVER, interactive: false }).addTo(g);

    const points = [...(line ?? []), pickup, dropoff, driver].filter((c): c is Coord => !!c);
    const only = points.length === 1 ? points[0] : undefined;
    if (only) {
      m.setView(toLatLng(only), 16);
    } else if (points.length > 1) {
      m.fitBounds(L.latLngBounds(points.map(toLatLng)), {
        paddingTopLeft: [48, 96],
        paddingBottomRight: [48, bottomInset + 32],
      });
    }
    // `key` summarises the inputs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return <View ref={host} style={styles.map} />;
}

const styles = StyleSheet.create({
  map: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: palette.ink50,
  },
});
