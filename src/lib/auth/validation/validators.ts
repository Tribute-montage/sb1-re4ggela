import { z } from 'zod';

// Base registration schema with common fields
const baseRegistrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

// Client registration schema
export const clientRegistrationSchema = baseRegistrationSchema.extend({
  name: z.string().min(2, 'Name is required'),
});

// Admin registration schema
export const adminRegistrationSchema = baseRegistrationSchema.extend({
  fullName: z.string().min(2, 'Full name is required'),
});

export type ClientRegistrationData = z.infer<typeof clientRegistrationSchema>;
export type AdminRegistrationData = z.infer<typeof adminRegistrationSchema>;

export async function validateClientRegistration(data: unknown) {
  return clientRegistrationSchema.parseAsync(data);
}

export async function validateAdminRegistration(data: unknown) {
  return adminRegistrationSchema.parseAsync(data);
}