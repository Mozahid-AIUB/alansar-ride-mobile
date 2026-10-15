import { isValidEmail } from './email';
import { bdSignificantDigits, isValidBdMobile } from './phone';

/** Matches the API's PASSWORD_MIN. */
export const PASSWORD_MIN = 8;

/** The API's `identifier` is an email if it contains "@", otherwise a phone number. */
export const isValidLoginId = (value: string): boolean =>
  value.includes('@') ? isValidEmail(value) : isValidBdMobile(bdSignificantDigits(value));
