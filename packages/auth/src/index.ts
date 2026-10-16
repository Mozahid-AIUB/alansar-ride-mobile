import { ApiError, authApi, type Tokens, type User } from '@alansar/api';

/**
 * The signed-in session, shared by both apps. A tiny external store, so React
 * reads it with `useSyncExternalStore` and this package needs no React import.
 *
 * Sign-in itself happens in the screens through `authApi`; they hand the result
 * to `signIn`. Google sign-in additionally needs Firebase (FIREBASE_ENABLED on
 * the API and a development build), which is not set up yet.
 */
export const googleReady = false;

/** Where the session is persisted: the keychain on a phone, localStorage on web. */
export type SessionStorage = {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
};

export type SessionState =
  | { status: 'restoring' }
  | { status: 'signedOut' }
  | { status: 'signedIn'; user: User; tokens: Tokens };

const STORAGE_KEY = 'alansar.session';

let state: SessionState = { status: 'restoring' };
let storage: SessionStorage | null = null;
const listeners = new Set<() => void>();

const setState = (next: SessionState) => {
  state = next;
  listeners.forEach((listener) => listener());
};

export const session = {
  getState: (): SessionState => state,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  accessToken: (): string | undefined =>
    state.status === 'signedIn' ? state.tokens.accessToken : undefined,
};

export async function signIn({ user, tokens }: { user: User; tokens: Tokens }) {
  await storage?.set(STORAGE_KEY, JSON.stringify({ user, tokens }));
  setState({ status: 'signedIn', user, tokens });
}

export async function signOut() {
  await storage?.remove(STORAGE_KEY);
  setState({ status: 'signedOut' });
}

const readSaved = async (): Promise<{ user: User; tokens: Tokens } | null> => {
  try {
    const raw = await storage?.get(STORAGE_KEY);
    const saved = raw ? JSON.parse(raw) : null;
    return saved?.user?.id && saved?.tokens?.refreshToken ? saved : null;
  } catch {
    return null;
  }
};

/**
 * Call once at start-up. A saved session signs the user in immediately, then
 * the refresh token is exchanged in the background for fresh tokens and the
 * latest profile. Only a rejected token signs them out; being offline does not.
 */
export async function restoreSession(store: SessionStorage) {
  storage = store;
  const saved = await readSaved();
  if (!saved) {
    setState({ status: 'signedOut' });
    return;
  }

  setState({ status: 'signedIn', ...saved });
  try {
    await signIn(await authApi.refresh(saved.tokens.refreshToken));
  } catch (err) {
    if (err instanceof ApiError && (err.status === 401 || err.status === 403)) await signOut();
  }
}
