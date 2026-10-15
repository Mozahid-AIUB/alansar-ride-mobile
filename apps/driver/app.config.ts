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
  },
  ios: {
    bundleIdentifier: 'com.inferloom.alansarridedriver',
  },
  plugins: ['expo-router'],
  experiments: { typedRoutes: true },
};

export default config;
