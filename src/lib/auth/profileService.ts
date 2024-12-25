import { supabase } from '../supabase/client';
import { AuthUser } from './types';
import { AUTH_ERRORS } from './constants';
import { logger } from '../api/core/logger';

export async function getUserProfile(userId: string): Promise<AuthUser> {
  try {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    if (!profile) throw new Error(AUTH_ERRORS.PROFILE_NOT_FOUND);

    return {
      id: profile.id,
      email: profile.email,
      name: profile.full_name,
      role: profile.role,
    };
  } catch (error) {
    logger.error('Error fetching user profile:', error);
    throw error;
  }
}

export async function updateUserProfile(userId: string, updates: Partial<AuthUser>): Promise<AuthUser> {
  try {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    if (!profile) throw new Error(AUTH_ERRORS.PROFILE_NOT_FOUND);

    return {
      id: profile.id,
      email: profile.email,
      name: profile.full_name,
      role: profile.role,
    };
  } catch (error) {
    logger.error('Error updating user profile:', error);
    throw error;
  }
}