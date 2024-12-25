import { supabase } from './client';
import { logger } from '../core/logger';

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count(*)')
      .single();

    if (error) {
      logger.error('Supabase connection test failed:', error);
      return false;
    }

    logger.info('Supabase connection test successful');
    return true;
  } catch (error) {
    logger.error('Supabase connection test error:', error);
    return false;
  }
}