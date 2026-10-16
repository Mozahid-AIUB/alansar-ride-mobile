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

/** Postgres numeric columns arrive as strings. */
type Numeric = string | number | null;

/** Mirrors vehicleType.service.js `availability()`. */
export type VehicleType = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  seats: number | null;
  sort_order: number;
  /** Drivers of this type online and not on a trip right now. */
  online_count: number;
};

/** The subset of ride.service.js WITH_PARTIES the apps read. */
export type Ride = {
  id: string;
  ride_code: string | null;
  status: string;
  pickup_name: string | null;
  pickup_address: string | null;
  dropoff_name: string | null;
  dropoff_address: string | null;
  requested_fare: Numeric;
  agreed_fare: Numeric;
  final_fare: Numeric;
  distance_km: Numeric;
  created_at?: string;
  vehicle_type_name: string | null;
  vehicle_type_slug: string | null;
  driver_name: string | null;
};

export type Pagination = { page: number; limit: number; total: number; pages: number };

/** With OTP switched off by the operator, sign-up returns a session straight away. */
export type Registration = ({ otpRequired: true } & CodeSent) | ({ otpRequired: false } & AuthSession);
