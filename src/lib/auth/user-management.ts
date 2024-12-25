import { supabase } from '../supabase/client';
import { logger } from '../core/logger';

export async function getRegisteredUsers() {
  try {
    const { data: users, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.full_name,
      role: user.role,
      createdAt: new Date(user.created_at).toLocaleString(),
    }));
  } catch (error) {
    logger.error('Error fetching registered users:', error);
    throw error;
  }
}