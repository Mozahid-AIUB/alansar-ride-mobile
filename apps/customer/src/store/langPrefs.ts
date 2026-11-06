import { i18n, type Language } from '@alansar/i18n';

import { secureStorage } from '@/services/storage';

/**
 * Wires the i18n package to the app's storage: the chosen language persists
 * across launches, English being the default until the user picks Bangla.
 */
const KEY = 'alansar.language';

export const langPrefs = {
  /** Read the saved choice once at start-up and tell i18n how to persist later. */
  restore: async () => {
    const saved = await secureStorage.get(KEY);
    i18n.configure({
      persist: (lang) => void secureStorage.set(KEY, lang),
      initial: saved === 'en' || saved === 'bn' ? (saved as Language) : null,
    });
  },
};
