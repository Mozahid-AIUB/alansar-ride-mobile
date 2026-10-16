/**
 * Thin fetch wrapper around the Express API's response envelope:
 *   success → `{ success: true, data }` (or extra top-level keys, see `raw`)
 *   failure → `{ success: false, error: { code, message, details? } }`
 */

export type FieldIssue = { path: string; message: string };

export class ApiError extends Error {
  constructor(
    message: string,
    /** HTTP status, or 0 when the server could not be reached at all. */
    readonly status: number,
    readonly code: string,
    readonly details?: FieldIssue[],
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type ApiConfig = {
  /** Origin only, e.g. `https://api.alansartaxi.com`; `/api` is added here. */
  baseUrl: string;
  getAccessToken?: () => string | undefined;
  /** Called once when an authorised request gets a 401; resolves to a new access token. */
  refreshAccessToken?: () => Promise<string | undefined>;
};

let config: ApiConfig = { baseUrl: '' };

export const configureApi = (next: ApiConfig) => {
  config = next;
};

/** Absolute URL for a path the API returns, such as an `/uploads/…` image. */
export const assetUrl = (path: string | null | undefined): string | undefined =>
  !path ? undefined : /^https?:\/\//.test(path) ? path : `${config.baseUrl}${path}`;

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

type Envelope =
  | ({ success: true; data?: unknown } & Record<string, unknown>)
  | { success: false; error: { code: string; message: string; details?: FieldIssue[] } };

async function send(method: Method, path: string, body: unknown, token: string | undefined) {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    return await fetch(`${config.baseUrl}/api${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("Can't reach the server. Check your internet connection.", 0, 'NETWORK');
  }
}

export async function request<T>(
  method: Method,
  path: string,
  body?: unknown,
  {
    auth = false,
    raw = false,
  }: {
    auth?: boolean;
    /** Return the whole envelope, for endpoints like ride history that put `items` beside `success`. */
    raw?: boolean;
  } = {},
): Promise<T> {
  let res = await send(method, path, body, auth ? config.getAccessToken?.() : undefined);

  // An expired access token: refresh once and replay.
  if (auth && res.status === 401 && config.refreshAccessToken) {
    const fresh = await config.refreshAccessToken();
    if (fresh) res = await send(method, path, body, fresh);
  }

  const json = (await res.json().catch(() => null)) as Envelope | null;
  if (res.ok && json?.success) return (raw ? json : json.data) as T;

  const error = json && !json.success ? json.error : undefined;
  throw new ApiError(
    // A validation failure's useful text is in the first field issue, not the summary.
    error?.details?.[0]?.message ?? error?.message ?? `Request failed (${res.status})`,
    res.status,
    error?.code ?? 'UNKNOWN',
    error?.details,
  );
}

/** A message that is safe to show the user for any thrown value. */
export const describeError = (err: unknown): string =>
  err instanceof ApiError ? err.message : 'Something went wrong. Please try again.';
