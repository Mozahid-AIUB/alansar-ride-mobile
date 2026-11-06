import { i18n, type Language } from '@alansar/i18n';

import { secureStorage } from '@/services/storage';

/** Wires the i18n package to the app's storage; English default, Bangla optional. */
const KEY = 'alansar.language';

export const langPrefs = {
  restore: async () => {
    const saved = await secureStorage.get(KEY);
    i18n.configure({
      persist: (lang) => void secureStorage.set(KEY, lang),
      initial: saved === 'en' || saved === 'bn' ? (saved as Language) : null,
    });
  },
};
