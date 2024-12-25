import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ErrorMessageProps {
  message: string;
  field?: string;
  className?: string;
}

export function ErrorMessage({ message, field, className }: ErrorMessageProps) {
  return (
    <div className={cn(
      "flex items-start space-x-2 text-red-600 text-sm",
      className
    )}>
      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
      <div>
        {field && (
          <span className="font-medium">{field}: </span>
        )}
        {message}
      </div>
    </div>
  );
}