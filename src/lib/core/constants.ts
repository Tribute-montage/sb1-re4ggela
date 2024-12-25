export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  EMAIL_IN_USE: 'Email already in use',
  WEAK_PASSWORD: 'Password is too weak',
  NETWORK_ERROR: 'Network error occurred'
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  REVIEW: 'review',
  COMPLETED: 'completed'
} as const;

export const VIDEO_TYPES = {
  BASIC_6: '6min-basic',
  SCENERY_6: '6min-scenery',
  BASIC_9: '9min-basic',
  SCENERY_9: '9min-scenery'
} as const;