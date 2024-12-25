import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../lib/auth/registration';
import { AUTH_ERRORS } from '../../lib/auth/constants';
import { toast } from 'sonner';
import { logger } from '../../lib/api/core/logger';

export function useRegistration() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegistration = async (
    email: string,
    password: string,
    name: string,
    role: 'client' | 'admin' = 'client'
  ) => {
    setLoading(true);
    try {
      await registerUser(email, password, name, role);
      
      toast.success('Registration successful! Please check your email to confirm your account.');
      navigate('/login');
      
      return true;
    } catch (error) {
      logger.error('Registration error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('email already in use')) {
          toast.error('This email is already registered. Please sign in instead.');
        } else {
          toast.error(error.message || AUTH_ERRORS.NETWORK_ERROR);
        }
      } else {
        toast.error(AUTH_ERRORS.NETWORK_ERROR);
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleRegistration,
    loading,
  };
}