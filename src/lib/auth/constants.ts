export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  EMAIL_NOT_CONFIRMED: 'Please verify your email address',
  NETWORK_ERROR: 'Network error occurred. Please try again.',
  LOGIN_TIMEOUT: 'Login request timed out. Please try again.',
  RESET_PASSWORD_FAILED: 'Failed to send reset password email',
  UNAUTHORIZED: 'Unauthorized access',
} as const;

export const AUTH_CONFIG = {
  LOGIN_TIMEOUT: 10000, // 10 seconds
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;