interface PublicRouteProps {
  children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  // Temporarily bypass auth check
  return <>{children}</>;
}