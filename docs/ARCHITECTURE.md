# Architecture

## System

```
 Customer app ─┐                         ┌─ PostgreSQL 16
               ├─ HTTPS + Socket.io ──── Express API ──┤
 Driver app ───┘                         └─ Firebase (FCM push)
 Admin panel (Next.js) ──────────────────┘
```

All on the existing VPS (Coolify). Only the mobile apps are being rewritten.

## Mobile stack

| Concern | Choice | Why |
|---|---|---|
| Framework | Expo + development builds, `expo prebuild` | Native modules allowed; `android/` and `ios/` are generated, not hand-edited |
| Language | TypeScript, strict | |
| Navigation | Expo Router | File-based, typed routes, deep links |
| Animation | react-native-reanimated | Runs on the UI thread, so animations stay smooth while JS is busy |
| Icons | phosphor-react-native | One consistent set with regular, bold, fill and duotone weights |
| Images | expo-image | Disk and memory caching, smooth placeholders |
| Long lists | @shopify/flash-list | Recycles rows; history, receipts, notifications |
| Server state | TanStack Query | Caching, retries, background refetch |
| Client state | Zustand | Small; replaces the Provider + Riverpod mix |
| Forms | react-hook-form + zod | Phone/email validation rules live in one schema |
| HTTP | fetch wrapper in `packages/api` | No dependency; unwraps the API's `{ success, data / error }` envelope into `ApiError` |
| Session | Small external store in `packages/auth`, read with `useSyncExternalStore` | Tokens in expo-secure-store; no React or store library inside shared packages |
| Realtime | socket.io-client | Same server as today |
| Maps | react-native-maps (Google) | Routes still come from `GET /api/rides/route` |
| Location | expo-location + expo-task-manager | Driver background tracking |
| Push | expo-notifications, native FCM token | The API already sends FCM, so the backend needs no change |
| Token storage | expo-secure-store | |
| i18n | i18next + expo-localization | Bangla and English |
| Tests | Jest + React Native Testing Library; Maestro for E2E | |
| Monitoring | Sentry | Crash reports per app |
| Build and release | EAS Build, EAS Submit, EAS Update | One pipeline for both apps |

## Rules

1. Apps import packages. Packages never import from an app.
2. Route files in `src/app/` only compose a screen from `src/features/`. No logic in routes.
3. Colours, spacing and type sizes come from `@alansar/theme`. No hex values in components.
4. All API calls go through `@alansar/api`. Screens never build URLs.
5. Code is shared only when both apps really need it. Otherwise it stays in that app's `src/`.

## Performance

1. React Compiler is on (`experiments.reactCompiler`), so components are memoised automatically. Don't add `useMemo` / `useCallback` by hand.
2. Animate with Reanimated shared values (`.get()` / `.set()`), never with React state.
3. Read Zustand stores through selectors (`useStore((s) => s.ride)`), never the whole store.
4. Use FlashList for any list that can grow. Never map a long array inside a ScrollView.
5. Live driver location updates the map marker directly. It must not re-render the whole screen.
6. Use `StyleSheet.create` and theme tokens. No inline style objects in lists.

## Notifications

| Event | App | Behaviour | Android | iOS |
|---|---|---|---|---|
| New trip offer | Driver | Loud alarm until answered | Full-screen intent + foreground service (small native module) | Time-sensitive notification with custom sound; Critical Alerts need Apple approval |
| Driver accepted | Customer | Loud sound, once | `customer_alerts` channel | Custom sound |
| Driver arrived | Customer | Loud sound, once | `customer_alerts` channel | Custom sound |

Sounds are in `packages/assets/sounds`.
