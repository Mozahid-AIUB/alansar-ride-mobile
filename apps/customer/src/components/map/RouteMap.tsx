import { useEffect, useRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, UrlTile } from 'react-native-maps';

import { lightTheme, palette } from '@alansar/theme';

import type { Coord } from '@/store/booking';
import { useMapProvider } from '@/store/mapPrefs';

import { DEFAULT_CENTER, OPEN_TILES } from './mapConfig';
import { CLEAN_MAP_STYLE } from './mapStyle';
import { DriverPin, DropoffPin, PickupPin } from './Pins';

const { spacing, typography, colors } = lightTheme;

export type RouteMapProps = {
  pickup: Coord | null;
  dropoff: Coord | null;
  /** Road-following line from GET /api/rides/route; a straight line is drawn without it. */
  route?: Coord[] | null;
  driver?: Coord | null;
  /** Space the bottom sheet covers, so the route is framed above it. */
  bottomInset?: number;
  /** False for a static preview inside a tappable card. */
  interactive?: boolean;
  /** Web only: the attribution caption is always shown on the phone free map. */
  showCaption?: boolean;
};

const INITIAL_REGION = { ...DEFAULT_CENTER, latitudeDelta: 0.12, longitudeDelta: 0.12 };

/**
 * The phone map (react-native-maps). Google Maps on Android, Apple Maps on iOS,
 * or — with the Mapbox provider — Mapbox tiles replacing the base map.
 */
export function RouteMap({ pickup, dropoff, route, driver, bottomInset = 0, interactive = true }: RouteMapProps) {
  const provider = useMapProvider();
  const free = provider === 'mapbox';
  const map = useRef<MapView>(null);
  const line = route?.length ? route : pickup && dropoff ? [pickup, dropoff] : null;

  const framing = [pickup, dropoff, driver, ...(route ?? [])].filter((c): c is Coord => !!c);
  const framingKey = framing.map((c) => `${c.latitude.toFixed(4)},${c.longitude.toFixed(4)}`).join('|');

  useEffect(() => {
    if (!framing.length) return;
    // One point (e.g. just the passenger): centre on it at street level instead of max zoom.
    const only = framing.length === 1 ? framing[0] : undefined;
    if (only) {
      map.current?.animateToRegion({ ...only, latitudeDelta: 0.012, longitudeDelta: 0.012 }, 400);
      return;
    }
    map.current?.fitToCoordinates(framing, {
      edgePadding: { top: 120, right: 60, bottom: bottomInset + 40, left: 60 },
      animated: true,
    });
    // framingKey stands in for the coordinate list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [framingKey, bottomInset]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <MapView
        // Remount when the provider changes: base map type cannot switch in place.
        key={provider}
        ref={map}
        style={StyleSheet.absoluteFill}
        provider={Platform.OS === 'android' && !free ? PROVIDER_GOOGLE : undefined}
        // On Android "none" hides Google's base map so only the Mapbox tiles draw.
        mapType={free && Platform.OS === 'android' ? 'none' : 'standard'}
        customMapStyle={free ? undefined : CLEAN_MAP_STYLE}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
        pitchEnabled={false}
        scrollEnabled={interactive}
        zoomEnabled={interactive}
        rotateEnabled={interactive}
        pointerEvents={interactive ? 'auto' : 'none'}
      >
        {free ? (
          <UrlTile
            urlTemplate={OPEN_TILES.url}
            maximumZ={OPEN_TILES.maxZoom}
            tileSize={OPEN_TILES.tileSize}
            shouldReplaceMapContent
          />
        ) : null}
        {line ? (
          <Polyline
            coordinates={line}
            strokeColor={palette.ink900}
            strokeWidth={route?.length ? 5 : 3}
            lineDashPattern={route?.length ? undefined : [8, 8]}
          />
        ) : null}
        {pickup ? (
          <Marker coordinate={pickup} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
            <PickupPin />
          </Marker>
        ) : null}
        {dropoff ? (
          <Marker coordinate={dropoff} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
            <DropoffPin />
          </Marker>
        ) : null}
        {driver ? (
          <Marker coordinate={driver} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
            <DriverPin />
          </Marker>
        ) : null}
      </MapView>
      {free ? (
        <Text style={[styles.attribution, { bottom: bottomInset + spacing.xs }]}>{OPEN_TILES.attribution}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  attribution: {
    ...typography.label,
    position: 'absolute',
    right: spacing.sm,
    paddingHorizontal: 4,
    color: colors.textMuted,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
});
