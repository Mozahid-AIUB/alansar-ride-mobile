# Flutter → React Native map

Source: `Apps/AlAnsarRideProjectMobileapps/app/lib`. `C` = customer app, `D` = driver app.

## Screens

| Flutter | New route | App |
|---|---|---|
| auth/login_screen | `src/app/(auth)/login.tsx` (phone number or Google, "Sign up" link below) | C, D |
| auth/register_screen | `src/app/(auth)/register.tsx` (name, phone, email, terms) | C, D |
| auth/register_otp_screen | `src/app/(auth)/verify.tsx` (SMS code; the account is created only after it) | C, D |
| auth/verify_email_screen | Not needed: the SMS code verifies the account | C, D |
| auth/forgot_password_screen, reset_password_screen | Not needed: sign-in has no password | C, D |
| auth/auth_gate | `src/app/_layout.tsx` (redirect by session) | C, D |
| onboarding/onboarding_screen | `src/app/onboarding.tsx` | C |
| customer/customer_shell | `src/app/(tabs)/_layout.tsx` | C |
| customer/customer_home_screen | `src/app/(tabs)/index.tsx` | C |
| customer/services_screen | `src/app/booking/services.tsx` | C |
| customer/location_search_screen | `src/app/booking/search.tsx` | C |
| customer/ride_review_screen | `src/app/booking/review.tsx` | C |
| customer/fare_offers_sheet | `src/features/booking/FareOffersSheet.tsx` | C |
| customer/finding_driver_screen | `src/app/booking/finding-driver.tsx` | C |
| customer/trip_screen | `src/app/trip/[id].tsx` | C |
| customer/rating_screen | `src/app/trip/rate.tsx` | C |
| driver/driver_shell | `src/app/(tabs)/_layout.tsx` | D |
| driver/driver_home_screen | `src/app/(tabs)/index.tsx` | D |
| driver/driver_advance_bookings_screen | `src/app/(tabs)/bookings.tsx` | D |
| driver/driver_earnings_screen | `src/app/(tabs)/earnings.tsx` | D |
| driver/driver_profile_screen | `src/app/(tabs)/profile.tsx` | D |
| driver/driver_registration_screen | `src/app/(onboarding)/register.tsx` | D |
| driver/driver_pending_screen | `src/app/(onboarding)/pending.tsx` | D |
| driver/ride_offer_sheet | `src/features/offers/RideOfferSheet.tsx` | D |
| driver/fare_offer_dialog | `src/features/offers/FareOfferDialog.tsx` | D |
| driver/trip_reminder_sheet | `src/features/offers/TripReminderSheet.tsx` | D |
| driver/driver_trip_screen | `src/app/trip/[id].tsx` | D |
| driver/rate_passenger_screen | `src/app/trip/rate.tsx` | D |
| driver/service_routes_screen | `src/app/service-routes/index.tsx` | D |
| shared/history_screen | C: `src/app/(tabs)/history.tsx`, D: `src/app/history.tsx` | C, D |
| shared/notifications_screen | C: `src/app/(tabs)/notifications.tsx`, D: `src/app/notifications.tsx` | C, D |
| shared/profile_screen | `src/app/(tabs)/profile.tsx` | C |
| shared/receipts_screen, receipt_screen | `src/app/receipts/index.tsx`, `src/app/receipts/[id].tsx` | C, D |
| shared/content_page_screen | `src/app/content/[slug].tsx` | C, D |
| support/support_screen, new_ticket_screen, support_thread_screen | `src/app/support/index.tsx`, `new.tsx`, `[id].tsx` | C, D |

## Non-screen code

| Flutter | New home |
|---|---|
| core/theme/app_theme | `packages/theme` (done) |
| core/network/api_client, data/services/api_service, envelope, data/models | `packages/api` |
| data/services/socket_service | `packages/realtime` |
| core/storage/token_storage, state/auth_provider | `packages/auth` |
| core/services/push_service, core/utils/alert_sound | `packages/notifications` |
| core/utils/battery_optimization_prompt | `apps/driver/src/services` |
| core/services/location_service | `apps/driver/src/services` (background), `packages/maps` (foreground) |
| widgets/live_map, core/utils/ride_map, data/models/route_result | `packages/maps` |
| widgets/common, ride_kit, booking_card, avatar_picker | `packages/ui` |
| core/utils/formatters, dialer, toast | `packages/utils`, `packages/ui` (toast) |
| core/utils/receipt_pdf | `packages/utils`, or use the API's invoice PDF |
| state/ride_provider, driver_provider, riverpod_providers | `apps/*/src/store` (Zustand) + query hooks in `packages/api` |
| core/config/app_config, app_flavor | `apps/*/app.config.ts` + `.env` (one app per flavour now) |
