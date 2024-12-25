import { supabase } from '../supabase/client';
import { User } from '../../types/user';

export async function signIn(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (!profile) throw new Error('User profile not found');

  return {
    id: profile.id,
    email: profile.email,
    name: profile.full_name,
    role: profile.role,
  };
}

export async function signUp(
  email: string,
  password: string,
  fullName: string
): Promise<void> {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}