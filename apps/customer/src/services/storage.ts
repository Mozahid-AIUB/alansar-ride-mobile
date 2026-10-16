import * as SecureStore from 'expo-secure-store';

import type { SessionStorage } from '@alansar/auth';

/** Keychain (iOS) / Keystore-backed storage (Android) for the session tokens. */
export const secureStorage: SessionStorage = {
  get: (key) => SecureStore.getItemAsync(key),
  set: (key, value) => SecureStore.setItemAsync(key, value),
  remove: (key) => SecureStore.deleteItemAsync(key),
};
