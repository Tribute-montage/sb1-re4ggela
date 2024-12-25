import { AuthError } from './types';
import { AUTH_ERRORS } from './constants';
import { logger } from '../api/core/logger';

export function handleAuthError(error: unknown): AuthError {
  logger.error('Auth error occurred:', error);

  if (error instanceof Error) {
    return {
      message: error.message,
      code: error.name,
      status: (error as AuthError).status,
    };
  }

  return {
    message: AUTH_ERRORS.NETWORK_ERROR,
    code: 'UNKNOWN_ERROR',
    status: 500,
  };
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}