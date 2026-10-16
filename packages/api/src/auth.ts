import { request } from './client';
import type { AuthSession, CodeSent, Registration, Tokens, User } from './types';

/** `/api/auth/*` — see the API's routes/auth.routes.js. */
export const authApi = {
  /** `identifier` is an email if it contains "@", otherwise a phone number in any spelling. */
  login: (identifier: string, password: string) =>
    request<AuthSession>('POST', '/auth/login', { identifier, password }),

  /** Holds the details and emails a code. No account exists until `verifyRegistration`. */
  register: (input: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: 'customer' | 'driver';
  }) => request<Registration>('POST', '/auth/register', input),

  verifyRegistration: (email: string, code: string) =>
    request<AuthSession>('POST', '/auth/register/verify', { email, code }),

  resendRegistrationCode: (email: string) =>
    request<CodeSent>('POST', '/auth/register/resend', { email }),

  /** Answers the same whether or not the email has an account. */
  forgotPassword: (email: string) => request<CodeSent>('POST', '/auth/password/forgot', { email }),

  resetPassword: (email: string, code: string, newPassword: string) =>
    request<{ reset: true }>('POST', '/auth/password/reset', { email, code, newPassword }),

  refresh: (refreshToken: string) =>
    request<{ user: User; tokens: Tokens }>('POST', '/auth/refresh-token', { refreshToken }),
};
