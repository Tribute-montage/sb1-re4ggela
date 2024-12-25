import { supabase } from '../supabase/client';
import { logger } from '../core/logger';
import { validateClientRegistration } from './validation/validators';
import { APP_CONFIG } from '../core/config';

interface RegistrationData {
  email: string;
  password: string;
  name: string;
  redirectTo?: string;
}

export class RegistrationService {
  static async registerClient(data: RegistrationData) {
    try {
      // Validate input data
      await validateClientRegistration(data);

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', data.email)
        .single();

      if (existingUser) {
        throw new Error('This email is already registered. Please sign in instead.');
      }

      logger.info('Starting client registration');

      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.name,
            role: 'client',
          },
          emailRedirectTo: data.redirectTo || APP_CONFIG.siteUrl
        },
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          throw new Error('This email is already registered. Please sign in instead.');
        }
        throw signUpError;
      }

      if (!authData.user) {
        throw new Error('Registration failed - no user returned');
      }

      // Wait for profile creation
      await new Promise(resolve => setTimeout(resolve, 1000));

      logger.info('Registration successful');
      return { success: true };
    } catch (error: any) {
      logger.error('Registration failed:', error);
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  }
}