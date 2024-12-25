import { Resend } from 'resend';

if (!import.meta.env.VITE_RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable');
}

export const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export const EMAIL_CONFIG = {
  from: 'notifications@tributemontage.com',
  replyTo: 'support@tributemontage.com',
};