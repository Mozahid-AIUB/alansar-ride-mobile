# Al Ansar Ride — Mobile

React Native rewrite of the Al Ansar Ride mobile apps. Two store apps, one repo:

| App | Folder | Store name | Android package |
|---|---|---|---|
| Customer | `apps/customer` | Al Ansar Ride | `com.inferloom.alansarridecustomer` |
| Driver | `apps/driver` | Al Ansar Driver | `com.inferloom.alansarridedriver` |

The package names match the Flutter builds, so these ship as updates to the existing listings.

The backend does not change: the existing Express + Socket.io API and PostgreSQL 16 on the VPS
(`https://api.alansartaxi.com`). The apps only talk to that API.

## Run

Requires Node 20+. pnpm is pinned in `package.json` (`corepack enable pnpm`, or prefix with `npx pnpm@12.11.2`).

```
pnpm install
pnpm customer        # Expo dev server for the customer app
```

Then press `w` for the browser, or open it on a phone with Expo Go (same Wi-Fi).

The app talks to the production API. Phones call it directly; the browser preview can't
(the API's CORS only allows its own sites), so run the dev proxy alongside it:

```
pnpm api-proxy       # http://localhost:8787 -> https://api.alansartaxi.com
```

## Structure

```
alansar-ride-mobile/
├── apps/
│   ├── customer/              Rider app (Expo SDK 57)
│   │   ├── src/
│   │   │   ├── app/           Routes (Expo Router, file-based). Keep these thin.
│   │   │   │   ├── (auth)/    login, register, register-otp, verify-email, forgot/reset password
│   │   │   │   ├── (tabs)/    home, history, notifications, profile
│   │   │   │   ├── booking/   services, search, review (fare), finding-driver
│   │   │   │   ├── trip/      live trip, rating
│   │   │   │   └── receipts/, support/, content/
│   │   │   ├── features/      Screens and their logic, one folder per feature
│   │   │   ├── components/    Customer-only components
│   │   │   ├── hooks/
│   │   │   ├── store/         Customer-only client state
│   │   │   └── services/      Push handlers, deep links
│   │   ├── assets/            Icon, splash
│   │   └── app.config.ts
│   └── driver/                Driver app (same layout)
│       └── src/app/
│           ├── (auth)/
│           ├── (onboarding)/  registration, documents, pending approval
│           ├── (tabs)/        home (online/offline), bookings, earnings, profile
│           ├── trip/          live trip, rate passenger
│           └── service-routes/, receipts/, support/, content/
├── packages/                  Shared by both apps
│   ├── theme/                 Design tokens ported from the Flutter app
│   ├── ui/                    Button, Input, Card, Sheet, Avatar, Toast, StatusBadge
│   ├── api/                   HTTP client, endpoints, types, query hooks
│   ├── realtime/              Socket.io client and typed events
│   ├── auth/                  Session, tokens, login / OTP / forgot-password flows
│   ├── maps/                  Map, markers, route polyline
│   ├── notifications/         Push, Android channels, alert sounds
│   ├── i18n/                  Bangla and English
│   ├── utils/                 Formatters, validation, constants
│   └── assets/                Logo and alert sounds
└── docs/
    ├── ARCHITECTURE.md        Stack, rules, performance, notifications design
    └── FLUTTER_TO_RN_MAP.md   Where every Flutter file goes
```

## Status

- Customer app: Welcome, Log in, Sign up (emailed code), Forgot / Reset password, and a Home
  dashboard, all against the live API. Google sign-in waits on Firebase.
- Driver app: structure only.
