import { supabase } from '../../supabase/client';
import { AuthResponse, AuthError } from './types';
import { logger } from '../core/logger';

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    logger.info('Attempting sign in', { email });

    const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      logger.error('Sign in failed', signInError);
      throw signInError;
    }

    if (!user) {
      logger.error('No user returned after sign in');
      throw new Error('Sign in failed');
    }

    // Get user profile with role
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      logger.error('Failed to fetch user profile', profileError);
      throw profileError;
    }

    if (!profile) {
      logger.error('User profile not found');
      throw new Error('User profile not found');
    }

    logger.info('Sign in successful', { 
      userId: profile.id,
      role: profile.role 
    });

    return {
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.full_name,
        role: profile.role,
      },
      error: null,
    };
  } catch (error) {
    logger.error('Sign in error', error);
    return {
      user: null,
      error: error as AuthError,
    };
  }
}