import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface SubmitButtonProps {
  loading?: boolean;
  text?: string;
  loadingText?: string;
}

export function SubmitButton({ 
  loading = false,
  text = 'Next Step',
  loadingText = 'Saving...'
}: SubmitButtonProps) {
  return (
    <div className="flex justify-end">
      <button
        type="submit"
        disabled={loading}
        className={cn(
          "inline-flex items-center px-4 py-2 border border-transparent",
          "rounded-md shadow-sm text-sm font-medium text-white",
          "bg-indigo-600 hover:bg-indigo-700 focus:outline-none",
          "focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        {loading && (
          <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
        )}
        {loading ? loadingText : text}
      </button>
    </div>
  );
}