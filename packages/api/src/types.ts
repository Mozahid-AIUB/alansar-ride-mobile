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

/** A ride with everything the trip screen reads (ride.service.js WITH_PARTIES). */
export type RideDetail = Ride & {
  pickup_location_id: string | null;
  dropoff_location_id: string | null;
  pickup_lat: Numeric;
  pickup_lng: Numeric;
  dropoff_lat: Numeric;
  dropoff_lng: Numeric;
  duration_minutes: Numeric;
  fare_agreed_at: string | null;
  scheduled_for: string | null;
  dispatched_at: string | null;
  notes: string | null;
  cancellation_reason: string | null;
  cancelled_by: string | null;
  accepted_at: string | null;
  arrived_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  driver_id: string | null;
  driver_phone: string | null;
  driver_avatar: string | null;
  driver_rating: Numeric;
  vehicle_number: string | null;
  vehicle_details: string | null;
  vehicle_photo_url: string | null;
  vehicle_seats: number | null;
  driver_lat: Numeric;
  driver_lng: Numeric;
};

/** A driver's counter-offer on a ride (offer.service.js OFFER_COLUMNS). */
export type FareOffer = {
  id: string;
  ride_id: string;
  driver_id: string;
  amount: Numeric;
  note: string | null;
  status: string;
  created_at: string;
  driver_name: string | null;
  driver_avatar: string | null;
  driver_rating: Numeric;
  driver_total_rides: number | null;
  vehicle_number: string | null;
  vehicle_type_name: string | null;
};

/** A catalogue location (location.service.js PUBLIC_COLUMNS). */
export type CatalogueLocation = {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  area: string | null;
  latitude: Numeric;
  longitude: Numeric;
};

/** A free-text geocoding hit (geocoding.service.js forwardGeocode). */
export type GeoResult = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

/** GET /api/rides/route */
export type RouteResult = {
  polyline: { lat: number; lng: number }[];
  distanceMeters: number;
  durationSeconds: number;
  hasTraffic: boolean;
};

/** POST /api/rides/estimate (ride.service.js estimate()). */
export type FareEstimate = {
  distanceKm: number | null;
  durationMinutes: number | null;
  estimatedFare: Numeric;
  fareSource: 'fixed' | 'distance' | 'minimum' | string;
  fareNote: string | null;
  isFixedFare: boolean;
  /** Whether the passenger may name their own price for this trip. */
  negotiable: boolean;
  vehicleTypeId: string | null;
};

/**
 * One end of a trip, as POST /api/rides/estimate and /request take it: a
 * catalogue location by id, or a raw coordinate with a label.
 */
export type TripEndpoint =
  | { locationId: string }
  | { latitude: number; longitude: number; label: string };

export type Pagination = { page: number; limit: number; total: number; pages: number };

/** A row of the API's `notifications` table, as GET /api/notifications returns it. */
export type AppNotification = {
  id: string;
  title: string;
  body: string | null;
  type: string | null;
  ride_id: string | null;
  ticket_id: string | null;
  is_read: boolean;
  created_at: string;
};

/** With OTP switched off by the operator, sign-up returns a session straight away. */
export type Registration = ({ otpRequired: true } & CodeSent) | ({ otpRequired: false } & AuthSession);
