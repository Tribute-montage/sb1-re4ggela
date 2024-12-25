import { z } from 'zod';

// Common validation schemas
export const emailSchema = z
  .string()
  .email()
  .min(5)
  .max(255)
  .transform(email => email.toLowerCase());

export const passwordSchema = z
  .string()
  .min(8)
  .max(72)
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');

export const urlSchema = z
  .string()
  .url()
  .max(2048);

// Security-related validation
export const ipAddressSchema = z
  .string()
  .ip({ version: 'v4' });

export const userAgentSchema = z
  .string()
  .max(500);

export const tokenSchema = z
  .string()
  .regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/);

// Sanitization functions
export function sanitizeHtml(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

export function sanitizeFilename(input: string): string {
  return input
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .toLowerCase();
}