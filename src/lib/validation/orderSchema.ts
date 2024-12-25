import { z } from 'zod';
import { isWithinBusinessHours, isValidDeliveryDate } from './rules/businessHours';
import { isHoliday } from './rules/holidays';

export const orderDetailsSchema = z.object({
  funeralHome: z.string().min(1, 'Funeral home is required'),
  orderNumber: z.string(),
  requestedDeliveryDate: z.string()
    .refine(
      (date) => {
        const deliveryDate = new Date(date);
        return isValidDeliveryDate(deliveryDate);
      },
      { message: 'Delivery date must be at least 24 hours from now and within 30 days' }
    )
    .refine(
      (date) => {
        const deliveryDate = new Date(date);
        return isWithinBusinessHours(deliveryDate);
      },
      { message: 'Delivery must be scheduled during business hours' }
    )
    .refine(
      (date) => {
        const deliveryDate = new Date(date);
        return !isHoliday(deliveryDate);
      },
      { message: 'Delivery cannot be scheduled on holidays' }
    ),
  videoType: z.enum(['6min-basic', '6min-scenery', '9min-basic', '9min-scenery']),
  subjectName: z.string().min(1, 'Subject name is required'),
  dateOfBirth: z.string().optional(),
  dateOfDeath: z.string().optional(),
  specialNotes: z.string().optional(),
});

export type OrderDetailsForm = z.infer<typeof orderDetailsSchema>;