import { supabase } from '../../supabase/client';
import { logger } from '../core/logger';

export async function signUp(
  email: string,
  password: string,
  fullName: string
): Promise<void> {
  try {
    logger.info('Starting user registration', { email });

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      logger.error('Registration failed', error);
      throw error;
    }

    if (!data.user) {
      logger.error('No user returned after registration');
      throw new Error('Registration failed');
    }

    logger.info('User registered successfully', { userId: data.user.id });
  } catch (error) {
    logger.error('Registration error', error);
    throw error;
  }
}