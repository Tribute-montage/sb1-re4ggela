import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import { logger } from '../../lib/core/logger';
import { toast } from 'sonner';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, logout } = useAuthStore();

  const signIn = async (email: string, password: string) => {
    // In development, bypass authentication
    if (import.meta.env.DEV) {
      const testUser = {
        id: 'test-editor-id',
        email: 'editor@test.com',
        name: 'Test Editor',
        role: 'editor',
      };
      login(testUser);
      navigate('/editor');
      return;
    }

    setLoading(true);
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!user) throw new Error('No user returned');

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile) throw new Error('User profile not found');

      login({
        id: user.id,
        email: user.email!,
        name: profile.full_name,
        role: profile.role,
      });

      navigate(profile.role === 'admin' ? '/admin' : '/editor');
    } catch (error) {
      logger.error('Sign in error:', error);
      toast.error('Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (import.meta.env.DEV) {
      logout();
      navigate('/login');
      return;
    }

    try {
      await supabase.auth.signOut();
      logout();
      navigate('/login');
    } catch (error) {
      logger.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  return {
    signIn,
    signOut,
    loading,
  };
}