import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { orderDetailsSchema, type OrderDetailsForm as OrderDetailsFormType } from '../../../lib/validation/schemas/orderSchema';
import { OrderFormFields } from './OrderFormFields';
import { ClientSelect } from './ClientSelect';
import { SubmitButton } from './SubmitButton';
import { generateOrderNumber } from '../../../lib/utils/orderNumber';

interface OrderDetailsFormProps {
  onSubmit: (data: OrderDetailsFormType) => void;
  defaultValues?: Partial<OrderDetailsFormType>;
  clients: Array<{ id: string; name: string; }>;
}

export function OrderDetailsForm({ onSubmit, defaultValues, clients }: OrderDetailsFormProps) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<OrderDetailsFormType>({
    resolver: zodResolver(orderDetailsSchema),
    defaultValues: {
      ...defaultValues,
      orderNumber: defaultValues?.orderNumber || generateOrderNumber('NEW'),
    },
  });

  const selectedClientId = watch('clientId');
  const selectedClient = clients.find(c => c.id === selectedClientId);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <ClientSelect
          clients={clients}
          error={errors.clientId}
          {...register('clientId')}
        />

        <OrderFormFields 
          register={register} 
          errors={errors}
          funeralHome={selectedClient?.name || ''}
        />
      </div>

      <SubmitButton text="Save and Continue" />
    </form>
  );
}