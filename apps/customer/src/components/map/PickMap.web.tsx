import { useEffect, useImperativeHandle, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { palette } from '@alansar/theme';

import { OPEN_TILES } from './mapConfig';
import type { PickMapProps } from './PickMap';

const STREET_ZOOM = 17;

/** Browser version of PickMap: Leaflet with the same tiles as RouteMap.web. */
export function PickMap({ initial, onMoveStart, onMoveEnd, ref }: PickMapProps) {
  const host = useRef<View>(null);
  const map = useRef<L.Map | null>(null);
  // Leaflet keeps the first handlers it is given; read the latest ones through refs.
  const handlers = useRef({ onMoveStart, onMoveEnd });
  useEffect(() => {
    handlers.current = { onMoveStart, onMoveEnd };
  });

  useImperativeHandle(ref, () => ({
    moveTo: (to) => map.current?.flyTo([to.latitude, to.longitude], STREET_ZOOM, { duration: 0.4 }),
  }));

  useEffect(() => {
    const el = host.current as unknown as HTMLElement | null;
    if (!el || map.current) return;
    const m = L.map(el, { zoomControl: false, attributionControl: true }).setView(
      [initial.latitude, initial.longitude],
      STREET_ZOOM,
    );
    L.tileLayer(OPEN_TILES.url, {
      maxZoom: OPEN_TILES.maxZoom,
      attribution: OPEN_TILES.attribution,
      tileSize: OPEN_TILES.tileSize,
      zoomOffset: OPEN_TILES.tileSize === 512 ? -1 : 0,
    }).addTo(m);
    m.attributionControl.setPrefix(false);
    m.on('movestart', () => handlers.current.onMoveStart());
    m.on('moveend', () => {
      const c = m.getCenter();
      handlers.current.onMoveEnd({ latitude: c.lat, longitude: c.lng });
    });
    map.current = m;

    const observer = new ResizeObserver(() => m.invalidateSize());
    observer.observe(el);
    return () => {
      observer.disconnect();
      m.remove();
      map.current = null;
    };
    // The starting point only matters once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
