import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface AnalyticsErrorProps {
  message: string;
  onRetry: () => void;
}

export function AnalyticsError({ message, onRetry }: AnalyticsErrorProps) {
  return (
    <div className="text-center py-12">
      <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Analytics</h3>
      <p className="text-gray-500 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className={cn(
          "inline-flex items-center px-4 py-2 border border-transparent",
          "rounded-md shadow-sm text-sm font-medium text-white",
          "bg-indigo-600 hover:bg-indigo-700"
        )}
      >
        Try Again
      </button>
    </div>
  );
}