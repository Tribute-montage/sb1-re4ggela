import React from 'react';
import { FormField } from './FormField';

interface DeliveryDatePickerProps extends React.ComponentPropsWithoutRef<'input'> {
  error?: { message?: string };
}

export const DeliveryDatePicker = React.forwardRef<HTMLInputElement, DeliveryDatePickerProps>(
  ({ error, ...props }, ref) => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1); // Minimum 1 day from now

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // Maximum 30 days from now

    return (
      <FormField
        ref={ref}
        label="Requested Delivery Date"
        type="date"
        min={minDate.toISOString().split('T')[0]}
        max={maxDate.toISOString().split('T')[0]}
        error={error}
        required
        {...props}
      />
    );
  }
);

DeliveryDatePicker.displayName = 'DeliveryDatePicker';