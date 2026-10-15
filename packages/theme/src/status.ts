import { palette } from './colors';

/** Ride status → colour and label. Must match `rideStatusTone` / `rideStatusLabel` in the admin panel. */
export type RideStatus = 'requested' | 'accepted' | 'started' | 'completed' | 'cancelled';

const statusColor: Record<RideStatus, string> = {
  requested: palette.warning,
  accepted: palette.info,
  started: palette.info,
  completed: palette.success,
  cancelled: palette.danger,
};

const statusLabel: Record<RideStatus, string> = {
  requested: 'Pending',
  accepted: 'Accepted',
  started: 'Ongoing',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const isRideStatus = (s: string): s is RideStatus => s in statusColor;

export const rideStatusColor = (status: string): string =>
  isRideStatus(status) ? statusColor[status] : palette.gray400;

export const rideStatusLabel = (status: string): string =>
  isRideStatus(status) ? statusLabel[status] : status;
