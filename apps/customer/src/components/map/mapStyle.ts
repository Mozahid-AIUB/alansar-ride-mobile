/**
 * Google Maps style: muted greys with roads in white, so the ink route and
 * the brand pins carry the colour. Ignored by Apple Maps.
 */
export const CLEAN_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#f2f4f5' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#6b7a85' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f7f8' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#e6eae4' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#dcebd6' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#7a8893' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#e2e7eb' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#cfdde8' }] },
];
