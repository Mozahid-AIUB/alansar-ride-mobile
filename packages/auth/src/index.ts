/**
 * Sign-in for both apps: phone number + SMS code, or Google. Both go through
 * Firebase Authentication, and the Firebase ID token is then exchanged at
 * `POST /api/auth/verify-firebase-token` for the API's own session.
 *
 * Not connected yet. It needs:
 *   1. Phone and Google sign-in enabled in the `alansar-ride-project` Firebase console
 *   2. FIREBASE_ENABLED=true and the service account on the API (Coolify env)
 *   3. A development build of the app (Firebase is native, so not Expo Go)
 *
 * Until then `authReady` is false and the sign-in screens run in preview mode.
 */
export const authReady = false;
