import { toast } from 'sonner';
import { logger } from '../core/logger';

export interface ApiError extends Error {
  code?: string;
  status?: number;
  details?: Record<string, any>;
}

export function handleApiError(error: unknown, fallbackMessage = 'An unexpected error occurred'): string {
  logger.error('API Error:', error);

  if (error instanceof Error) {
    const apiError = error as ApiError;
    const message = apiError.message || fallbackMessage;
    
    // Show toast notification
    toast.error(message);
    
    // Log additional details if available
    if (apiError.details) {
      logger.error('Error details:', apiError.details);
    }
    
    return message;
  }

  // Handle unknown errors
  toast.error(fallbackMessage);
  logger.error('Unknown error:', error);
  return fallbackMessage;
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof Error && 'code' in error;
}