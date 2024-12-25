```typescript
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../../store/useAuthStore';
import { orderDetailsSchema, type OrderDetailsForm as OrderDetailsFormType } from '../../lib/validation/orderSchema';
import { OrderFormFields } from './form/OrderFormFields';
import { SubmitButton } from './form/SubmitButton';
import { generateOrderNumber } from '../../lib/utils/orderNumber';

interface OrderDetailsFormProps {
  onSubmit: (data: OrderDetailsFormType) => void;
  defaultValues?: Partial<OrderDetailsFormType>;
}

export function OrderDetailsForm({ onSubmit, defaultValues }: OrderDetailsFormProps) {
  const { user } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm<OrderDetailsFormType>({
    resolver: zodResolver(orderDetailsSchema),
    defaultValues: {
      ...defaultValues,
      funeralHome: defaultValues?.funeralHome || user?.name || '',
      orderNumber: defaultValues?.orderNumber || generateOrderNumber(user?.name || 'Unknown'),
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <OrderFormFields register={register} errors={errors} />
      <SubmitButton />
    </form>
  );
}
```