import { useImperativeHandle, useRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, UrlTile } from 'react-native-maps';

import { lightTheme } from '@alansar/theme';

import type { Coord } from '@/store/booking';
import { useMapProvider } from '@/store/mapPrefs';

import { OPEN_TILES } from './mapConfig';
import { CLEAN_MAP_STYLE } from './mapStyle';

const { spacing, typography, colors } = lightTheme;

/** Street level: close enough to tell one building from the next. */
const STREET_DELTA = 0.004;

export type PickMapHandle = {
  /** Glide the map so `to` sits under the centre pin. */
  moveTo: (to: Coord) => void;
};

export type PickMapProps = {
  initial: Coord;
  /** The passenger started dragging; the pin's label is out of date. */
  onMoveStart: () => void;
  /** The map came to rest with `center` under the pin. */
  onMoveEnd: (center: Coord) => void;
  ref?: React.Ref<PickMapHandle>;
};

/**
 * A map to drag under a fixed centre pin (the pin itself is drawn by the
 * screen). Same Google / Mapbox choice as RouteMap.
 */
export function PickMap({ initial, onMoveStart, onMoveEnd, ref }: PickMapProps) {
  const provider = useMapProvider();
  const free = provider === 'mapbox';
  const map = useRef<MapView>(null);

  useImperativeHandle(ref, () => ({
    moveTo: (to) =>
      map.current?.animateToRegion({ ...to, latitudeDelta: STREET_DELTA, longitudeDelta: STREET_DELTA }, 400),
  }));

  return (
    <View style={StyleSheet.absoluteFill}>
      <MapView
        key={provider}
        ref={map}
        style={StyleSheet.absoluteFill}
        provider={Platform.OS === 'android' && !free ? PROVIDER_GOOGLE : undefined}
        mapType={free && Platform.OS === 'android' ? 'none' : 'standard'}
        customMapStyle={free ? undefined : CLEAN_MAP_STYLE}
        initialRegion={{ ...initial, latitudeDelta: STREET_DELTA, longitudeDelta: STREET_DELTA }}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
        onPanDrag={onMoveStart}
        onRegionChangeComplete={(region) => onMoveEnd({ latitude: region.latitude, longitude: region.longitude })}
      >
        {free ? (
          <UrlTile
            urlTemplate={OPEN_TILES.url}
            maximumZ={OPEN_TILES.maxZoom}
            tileSize={OPEN_TILES.tileSize}
            shouldReplaceMapContent
          />
        ) : null}
      </MapView>
      {free ? <Text style={styles.attribution}>{OPEN_TILES.attribution}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  attribution: {
    ...typography.label,
    position: 'absolute',
    right: spacing.sm,
    bottom: spacing.xs,
    paddingHorizontal: 4,
    color: colors.textMuted,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
});
