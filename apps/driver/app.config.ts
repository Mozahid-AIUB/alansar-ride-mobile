import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Al Ansar Driver',
  slug: 'alansar-driver',
  scheme: 'alansardriver',
  version: '2.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  icon: '../../packages/assets/images/app_logo.png',
  android: {
    // Same package as the Flutter build, so this ships as an update to the
    // existing Play Store listing rather than as a new app.
    package: 'com.inferloom.alansarridedriver',
    // Must stay above the last Flutter build (1.0.0+2).
    versionCode: 3,
    config: { googleMaps: { apiKey: process.env.GOOGLE_MAPS_ANDROID_API_KEY } },
  },
  ios: {
    bundleIdentifier: 'com.inferloom.alansarridedriver',
  },
  plugins: [
    'expo-router',
    [
      'expo-location',
      {
        locationWhenInUsePermission:
          'Al Ansar Driver uses your location to show you to riders and guide you on trips.',
      },
    ],
  ],
  experiments: { typedRoutes: true, reactCompiler: true },
};

export default config;
