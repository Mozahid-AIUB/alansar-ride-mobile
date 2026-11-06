import { useSyncExternalStore } from 'react';

import { bn, en, type TranslationKey } from './translations';

export type Language = 'en' | 'bn';
export type { TranslationKey };
export { en, bn } from './translations';

type Vars = Record<string, string | number>;

const DICT: Record<Language, Partial<Record<TranslationKey, string>>> = { en, bn };

let language: Language = 'en';
const listeners = new Set<() => void>();

/** Optional sink so the app can persist the choice (e.g. secureStorage). */
let persist: ((lang: Language) => void) | null = null;

const notify = () => listeners.forEach((l) => l());

export const i18n = {
  get: (): Language => language,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  set: (next: Language) => {
    if (next === language) return;
    language = next;
    notify();
    persist?.(next);
  },
  /** App-level glue: give i18n a way to save the choice, and the saved value. */
  configure: (options: { persist?: (lang: Language) => void; initial?: Language | null }) => {
    persist = options.persist ?? null;
    if (options.initial === 'en' || options.initial === 'bn') {
      language = options.initial;
      notify();
    }
  },
};

/** Fill {slots} in a string from `vars`. */
const interpolate = (text: string, vars?: Vars) =>
  vars ? text.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`)) : text;

/** Translate `key` in the given language, falling back to English then the key. */
export function translate(lang: Language, key: TranslationKey, vars?: Vars): string {
  const text = DICT[lang]?.[key] ?? en[key] ?? key;
  return interpolate(text, vars);
}

/** The current language, re-rendering the component when it changes. */
export const useLanguage = (): Language =>
  useSyncExternalStore(i18n.subscribe, i18n.get, i18n.get);

/** A `t()` bound to the current language. Use inside components. */
export function useT(): (key: TranslationKey, vars?: Vars) => string {
  const lang = useLanguage();
  return (key, vars) => translate(lang, key, vars);
}
