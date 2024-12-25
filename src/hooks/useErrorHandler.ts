import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { AppError } from '../lib/errors/types';

export function useErrorHandler() {
  const [error, setError] = useState<AppError | null>(null);

  const handleError = useCallback((error: unknown) => {
    if (error instanceof Error) {
      setError(error as AppError);
      
      // Show toast notification
      toast.error(error.message, {
        description: error.code ? `Error Code: ${error.code}` : undefined,
      });

      // Log error
      console.error('Application error:', {
        name: error.name,
        message: error.message,
        code: (error as AppError).code,
        details: (error as AppError).details,
      });
    } else {
      // Handle unknown errors
      const unknownError = new Error('An unexpected error occurred');
      setError(unknownError);
      toast.error(unknownError.message);
      console.error('Unknown error:', error);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
  };
}