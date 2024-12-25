import React from 'react';
import { CreditCard, Clock } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface SubmitOptionsProps {
  onSubmit: (payNow: boolean) => void;
  disabled: boolean;
}

export function SubmitOptions({ onSubmit, disabled }: SubmitOptionsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          onClick={() => onSubmit(true)}
          disabled={disabled}
          className={cn(
            "flex items-center justify-center px-4 py-3 border border-transparent",
            "text-base font-medium rounded-md text-white bg-indigo-600",
            "hover:bg-indigo-700 focus:outline-none focus:ring-2",
            "focus:ring-offset-2 focus:ring-indigo-500",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <CreditCard className="h-5 w-5 mr-2" />
          Submit and Pay Now
        </button>

        <button
          onClick={() => onSubmit(false)}
          disabled={disabled}
          className={cn(
            "flex items-center justify-center px-4 py-3 border border-gray-300",
            "text-base font-medium rounded-md text-gray-700 bg-white",
            "hover:bg-gray-50 focus:outline-none focus:ring-2",
            "focus:ring-offset-2 focus:ring-indigo-500",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <Clock className="h-5 w-5 mr-2" />
          Submit and Pay Later
        </button>
      </div>

      <p className="text-sm text-center text-gray-500">
        By submitting this order, you agree to our terms and conditions.
      </p>
    </div>
  );
}