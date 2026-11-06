import type { SessionStorage } from '@alansar/auth';

/**
 * Web has no keychain, so the browser preview keeps the session in
 * localStorage. Fine for development; the phone apps use storage.ts.
 */
export const secureStorage: SessionStorage = {
  get: async (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: async (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Private mode or blocked storage: the session simply won't survive a reload.
    }
  },
  remove: async (key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Nothing to remove.
    }
  },
};
