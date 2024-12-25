import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormField } from './FormField';
import { VideoTypeSelect } from './VideoTypeSelect';
import { DeliveryDatePicker } from './DeliveryDatePicker';
import type { OrderDetailsForm } from '../../../lib/validation/schemas/orderSchema';

interface OrderFormFieldsProps {
  register: UseFormRegister<OrderDetailsForm>;
  errors: FieldErrors<OrderDetailsForm>;
}

export function OrderFormFields({ register, errors }: OrderFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <FormField
        label="Funeral Home"
        error={errors.funeralHome}
        readOnly
        {...register('funeralHome')}
      />

      <FormField
        label="Order Number"
        error={errors.orderNumber}
        readOnly
        {...register('orderNumber')}
      />

      <DeliveryDatePicker
        error={errors.requestedDeliveryDate}
        {...register('requestedDeliveryDate')}
      />

      <VideoTypeSelect
        error={errors.videoType}
        {...register('videoType')}
      />

      <FormField
        label="Subject Full Name"
        error={errors.subjectName}
        required
        {...register('subjectName')}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Date of Birth"
          type="date"
          error={errors.dateOfBirth}
          max={new Date().toISOString().split('T')[0]}
          {...register('dateOfBirth')}
        />

        <FormField
          label="Date of Death"
          type="date"
          error={errors.dateOfDeath}
          max={new Date().toISOString().split('T')[0]}
          {...register('dateOfDeath')}
        />
      </div>

      <div className="sm:col-span-2">
        <FormField
          as="textarea"
          label="Special Notes"
          error={errors.specialNotes}
          rows={3}
          {...register('specialNotes')}
        />
      </div>
    </div>
  );
}