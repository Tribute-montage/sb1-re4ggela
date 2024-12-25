// src/hooks/auth/useAdminAuth.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAdminUser, verifyAdminAccess } from '../../lib/auth/adminService';
import { AuthUser } from '../../lib/auth/types';
import { AUTH_ERRORS } from '../../lib/auth/constants';
import { toast } from 'sonner';

export function useAdminAuth() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateAdmin = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<AuthUser | null> => {
    setLoading(true);
    try {
      const user = await createAdminUser(email, password, fullName);
      toast.success('Admin user created successfully');
      return user;
    } catch (error) {
      console.error('Admin creation error:', error);
      toast.error(error instanceof Error ? error.message : AUTH_ERRORS.NETWORK_ERROR);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const checkAdminAccess = async (userId: string): Promise<boolean> => {
    try {
      const isAdmin = await verifyAdminAccess(userId);
      if (!isAdmin) {
        navigate('/dashboard');
        toast.error(AUTH_ERRORS.UNAUTHORIZED);
      }
      return isAdmin;
    } catch (error) {
      console.error('Admin verification error:', error);
      navigate('/dashboard');
      toast.error(AUTH_ERRORS.NETWORK_ERROR);
      return false;
    }
  };

  return {
    handleCreateAdmin,
    checkAdminAccess,
    loading,
  };
}