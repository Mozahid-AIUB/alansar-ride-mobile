/**
 * Sign-in for both apps, against the existing API:
 *
 *   Log in            phone or email + password     POST /api/auth/login
 *   Sign up           details, then emailed code    POST /api/auth/register, /register/verify
 *   Forgot password   emailed code + new password   POST /api/auth/password/forgot, /password/reset
 *   Google            Firebase ID token             POST /api/auth/verify-firebase-token
 *
 * The screens are built but not wired to the API yet, so `authReady` is false
 * and they run in preview mode. Google also needs Firebase enabled on the API
 * (FIREBASE_ENABLED=true) and a development build of the app.
 */
export const authReady = false;
