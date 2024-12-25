import { z } from 'zod';
import { ValidationError } from './errors';
import { UPLOAD_CONFIG } from './config';

export const validateFile = (file: File): void => {
  if (file.size > UPLOAD_CONFIG.maxFileSize) {
    throw new ValidationError(`File ${file.name} is too large. Maximum size is 10MB`);
  }

  const isValidType = UPLOAD_CONFIG.allowedTypes.some(type => {
    const [category] = type.split('/');
    return file.type.startsWith(`${category}/`);
  });

  if (!isValidType) {
    throw new ValidationError(`File ${file.name} has an invalid type`);
  }
};

export const validateFiles = (files: File[]): void => {
  files.forEach(validateFile);
};

// Schema for order creation
export const orderSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  videoType: z.enum(['6min-basic', '6min-scenery', '9min-basic', '9min-scenery']),
  requestedDeliveryDate: z.string().refine(
    (date) => new Date(date) > new Date(),
    'Delivery date must be in the future'
  ),
  subjectName: z.string().min(1, 'Subject name is required'),
  dateOfBirth: z.string().optional(),
  dateOfDeath: z.string().optional(),
  specialNotes: z.string().optional(),
});

export type OrderInput = z.infer<typeof orderSchema>;