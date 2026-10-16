import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Al Ansar Ride',
  slug: 'alansar-ride',
  scheme: 'alansarride',
  version: '2.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  icon: '../../packages/assets/images/app_logo.png',
  android: {
    // Same package as the Flutter build, so this ships as an update to the
    // existing Play Store listing rather than as a new app.
    package: 'com.inferloom.alansarridecustomer',
    // Must stay above the last Flutter build (1.0.0+2).
    versionCode: 3,
    // Google Maps SDK for Android (free for in-app maps). Expo Go brings its
    // own key; a store build needs this set in the build environment.
    config: { googleMaps: { apiKey: process.env.GOOGLE_MAPS_ANDROID_API_KEY } },
  },
  ios: {
    // The Flutter iOS target used com.alansar.alansarRide. If that is live on
    // the App Store, use it here instead.
    bundleIdentifier: 'com.inferloom.alansarridecustomer',
  },
  plugins: [
    'expo-router',
    [
      'expo-location',
      {
        locationWhenInUsePermission:
          'Al Ansar Ride uses your location to set your pickup point and show you on the map.',
      },
    ],
  ],
  experiments: { typedRoutes: true, reactCompiler: true },
};

export default config;
