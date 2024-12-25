import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { hasPermission, type Permission } from '../../lib/security/permissions';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission: Permission;
  fallback?: React.ReactNode;
}

export function PermissionGuard({ children, permission, fallback }: PermissionGuardProps) {
  const { user } = useAuthStore();
  const [hasAccess, setHasAccess] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;

    hasPermission(user.id, permission).then(setHasAccess);
  }, [user, permission]);

  if (!hasAccess) {
    return fallback || null;
  }

  return <>{children}</>;
}