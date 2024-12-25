import React from 'react';
import { XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { FileUploadError } from '../../lib/errors/types';

interface FileUploadErrorProps {
  error: FileUploadError;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function FileUploadError({ error, onRetry, onDismiss }: FileUploadErrorProps) {
  return (
    <div className="bg-red-50 p-4 rounded-md">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Upload Failed
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error.message}</p>
            {error.details?.size && (
              <p className="mt-1">
                File size: {(error.details.size / 1024 / 1024).toFixed(1)}MB
                (Max: {(error.details.maxSize / 1024 / 1024).toFixed(1)}MB)
              </p>
            )}
          </div>
          <div className="mt-4">
            <div className="flex space-x-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className={cn(
                    "bg-red-50 text-red-800 hover:bg-red-100",
                    "px-3 py-2 text-sm font-medium rounded-md"
                  )}
                >
                  Try Again
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="text-sm font-medium text-red-800 hover:text-red-900"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}