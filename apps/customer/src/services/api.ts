import { Platform } from 'react-native';

import { configureApi } from '@alansar/api';
import { session } from '@alansar/auth';

const PRODUCTION_API = 'https://api.alansartaxi.com';

/**
 * The API only accepts browser requests from its own sites (CORS), so the web
 * preview goes through `pnpm api-proxy` (scripts/dev-api-proxy.mjs). Phones
 * send no Origin header and talk to the API directly.
 */
const WEB_DEV_PROXY = 'http://localhost:8787';

export const API_URL =
  Platform.OS === 'web' && __DEV__
    ? WEB_DEV_PROXY
    : (process.env.EXPO_PUBLIC_API_URL ?? PRODUCTION_API);

export function setUpApi() {
  configureApi({ baseUrl: API_URL, getAccessToken: session.accessToken });
}
