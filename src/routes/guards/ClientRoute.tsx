import { useNavigate } from 'react-router-dom';

interface ClientRouteProps {
  children: React.ReactNode;
}

export function ClientRoute({ children }: ClientRouteProps) {
  // Temporarily bypass auth check
  return <>{children}</>;
}