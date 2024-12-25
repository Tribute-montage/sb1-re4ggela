import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export function useAuthGuard(allowedRoles?: ('client' | 'admin')[]) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login', { state: { from: location }, replace: true });
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, allowedRoles, navigate, location]);

  return { user, isAuthenticated };
}