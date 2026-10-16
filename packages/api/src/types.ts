/** Mirrors PUBLIC_USER_COLUMNS in the API's auth.service.js. */
export type User = {
  id: string;
  firebase_uid: string | null;
  phone: string | null;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  user_type: 'customer' | 'driver' | 'admin';
  status: string;
  admin_role: string | null;
  created_at: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
  /** e.g. "1h" */
  expiresIn: string;
};

export type AuthSession = {
  user: User;
  tokens: Tokens;
  isNewUser?: boolean;
  emailVerificationRequired?: boolean;
};

export type CodeSent = {
  /** False when the email could not be delivered; the code still exists and can be resent. */
  sent: boolean;
  email: string;
  expiresInMinutes: number;
};

/** With OTP switched off by the operator, sign-up returns a session straight away. */
export type Registration = ({ otpRequired: true } & CodeSent) | ({ otpRequired: false } & AuthSession);
