import { supabase } from '../supabase/client';
import { AuthUser } from './types';
import { AUTH_ERRORS } from './constants';
import { logger } from '../api/core/logger';

export async function registerUser(
  email: string,
  password: string,
  name: string,
  role: 'client' | 'admin' = 'client'
): Promise<AuthUser> {
  try {
    logger.info('Starting user registration', { email, role });

    // First, check if email already exists
    const { data: existingUser } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create auth user
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role,
        },
      },
    });

    if (signUpError) throw signUpError;
    if (!user) throw new Error(AUTH_ERRORS.USER_NOT_FOUND);

    // Wait a moment for the trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify profile was created
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      logger.error('Profile verification failed', profileError);
      throw new Error('Failed to verify user profile');
    }

    logger.info('User registered successfully', { userId: user.id });

    return {
      id: user.id,
      email: user.email!,
      name: profile.full_name,
      role: profile.role,
    };
  } catch (error) {
    logger.error('Registration error:', error);
    throw error;
  }
}