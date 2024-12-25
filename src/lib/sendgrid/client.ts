import { APP_CONFIG } from '../core/config';
import { logger } from '../core/logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

const DEFAULT_FROM = 'notifications@tributemontage.com';

export async function sendEmail({
  to,
  subject,
  html,
  from = DEFAULT_FROM
}: EmailOptions): Promise<void> {
  try {
    // In development, just log the email
    if (import.meta.env.DEV) {
      logger.info('Email would be sent:', {
        to,
        from,
        subject,
        html
      });
      return;
    }

    // In production, make the API call to SendGrid
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: to }]
        }],
        from: { email: from },
        subject,
        content: [{
          type: 'text/html',
          value: html
        }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send email');
    }

    logger.info('Email sent successfully', { to, subject });
  } catch (error) {
    logger.error('Failed to send email:', error);
    throw error;
  }
}