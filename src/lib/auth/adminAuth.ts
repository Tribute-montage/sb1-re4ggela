import { supabase } from '../supabase/client';
import { logger } from '../api/core/logger';

export async function verifyAdminCredentials(email: string, password: string) {
  try {
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      logger.error('Admin verification failed', error);
      return false;
    }

    if (!user) {
      logger.error('No user found during admin verification');
      return false;
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    return profile?.role === 'admin';
  } catch (error) {
    logger.error('Error during admin verification', error);
    return false;
  }
}