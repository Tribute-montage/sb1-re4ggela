import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../../lib/auth/authService';
import { useAuthStore } from '../../store/useAuthStore';
import { AUTH_ERRORS } from '../../lib/auth/constants';
import { toast } from 'sonner';
import { logger } from '../../lib/api/core/logger';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user, error } = await signIn(email, password);
      
      if (error) {
        logger.error('Login failed:', error);
        toast.error(error.message || AUTH_ERRORS.INVALID_CREDENTIALS);
        return false;
      }

      if (!user) {
        toast.error(AUTH_ERRORS.USER_NOT_FOUND);
        return false;
      }

      login(user);
      toast.success('Successfully logged in');
      
      // Redirect based on role
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
      
      return true;
    } catch (error) {
      logger.error('Unexpected login error:', error);
      toast.error(AUTH_ERRORS.NETWORK_ERROR);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading };
}