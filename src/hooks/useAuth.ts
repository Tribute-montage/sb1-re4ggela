// src/hooks/useAuth.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../lib/auth/auth.service';
import { useAuthStore } from '../store/useAuthStore';
import type { LoginCredentials, RegistrationData } from '../types/auth';
import { toast } from 'sonner';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, logout } = useAuthStore();

  const handleLogin = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const user = await AuthService.signIn(credentials);
      login(user);
      toast.success('Successfully signed in');
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: RegistrationData) => {
    setLoading(true);
    try {
      await AuthService.signUp(data);
      toast.success('Registration successful! Please sign in.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AuthService.signOut();
      logout();
      navigate('/login');
      toast.success('Successfully signed out');
    } catch (error: any) {
      toast.error('Failed to sign out');
    }
  };

  return {
    loading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
}