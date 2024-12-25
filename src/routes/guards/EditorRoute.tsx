import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

interface EditorRouteProps {
  children: React.ReactNode;
}

export function EditorRoute({ children }: EditorRouteProps) {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  // In development, allow access
  if (import.meta.env.DEV) {
    return <>{children}</>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'editor') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}