// src/lib/auth/auth.service.ts
import { supabase } from '../supabase/client';
import type { AuthUser, LoginCredentials, RegistrationData, UserProfile } from '../../types/auth';
import { toast } from 'sonner';

export class AuthService {
  static async signIn({ email, password }: LoginCredentials): Promise<AuthUser> {
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      if (!user) throw new Error('No user returned');

      // Get user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile) throw new Error('No profile found');

      return {
        id: user.id,
        email: user.email!,
        name: profile.full_name,
        role: profile.role
      };
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message);
    }
  }

  static async signUp(data: RegistrationData): Promise<void> {
    try {
      const { email, password, full_name, role = 'client' } = data;

      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            role
          }
        }
      });

      if (error) throw error;
      if (!user) throw new Error('No user returned');

      // Profile is created automatically via database trigger
      toast.success('Registration successful! Please sign in.');
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.message);
    }
  }

  static async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile) return null;

      return {
        id: user.id,
        email: user.email!,
        name: profile.full_name,
        role: profile.role
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }
}