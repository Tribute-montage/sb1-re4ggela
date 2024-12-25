import React from 'react';
import { cn } from '../../../lib/utils';

interface FormFieldProps extends React.ComponentPropsWithoutRef<'input'> {
  label: string;
  error?: { message?: string };
  as?: 'input' | 'textarea' | 'select';
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, as = 'input', className, ...props }, ref) => {
    const Component = as;
    
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <Component
          ref={ref}
          className={cn(
            "mt-1 block w-full rounded-md border-gray-300 shadow-sm",
            "focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
            error && "border-red-300",
            className
          )}
          {...props}
        />
        {error?.message && (
          <p className="mt-1 text-sm text-red-600">{error.message}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';