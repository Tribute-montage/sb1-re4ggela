import { supabase } from '../supabase/client';
import { AuthUser } from './types';
import { logger } from '../api/core/logger';

export async function createAdminUser(
  email: string,
  password: string,
  name: string
): Promise<AuthUser> {
  try {
    logger.info('Creating admin user', { email });

    // Create auth user with admin role in metadata
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: 'admin',
        },
      },
    });

    if (signUpError) throw signUpError;
    if (!user) throw new Error('Failed to create user');

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

    logger.info('Admin user created successfully', { userId: user.id });

    return {
      id: user.id,
      email: user.email!,
      name: profile.full_name,
      role: profile.role,
    };
  } catch (error) {
    logger.error('Error creating admin user:', error);
    throw error;
  }
}