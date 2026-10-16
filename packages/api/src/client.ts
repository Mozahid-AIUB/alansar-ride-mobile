/**
 * Thin fetch wrapper around the Express API's response envelope:
 *   success → `{ success: true, data }`
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
};

let config: ApiConfig = { baseUrl: '' };

export const configureApi = (next: ApiConfig) => {
  config = next;
};

type Envelope<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string; details?: FieldIssue[] } };

export async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  body?: unknown,
  { auth = false }: { auth?: boolean } = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = config.getAccessToken?.();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${config.baseUrl}/api${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("Can't reach the server. Check your internet connection.", 0, 'NETWORK');
  }

  const json = (await res.json().catch(() => null)) as Envelope<T> | null;
  if (res.ok && json?.success) return json.data;

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
