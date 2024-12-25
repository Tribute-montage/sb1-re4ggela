import { supabase } from '../supabase/client';
import { logger } from '../core/logger';

export type UserRole = 'super_admin' | 'admin' | 'editor' | 'client';

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export async function getUserPermissions(userId: string): Promise<string[]> {
  try {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (!profile) return [];

    const { data: permissions } = await supabase
      .from('role_permissions')
      .select(`
        permission:permissions (
          name
        )
      `)
      .eq('role', profile.role);

    return permissions?.map(p => p.permission.name) || [];
  } catch (error) {
    logger.error('Error fetching user permissions:', error);
    return [];
  }
}

export async function checkPermission(userId: string, permission: string): Promise<boolean> {
  try {
    const { data } = await supabase
      .rpc('check_user_permission', {
        user_id: userId,
        permission_name: permission,
      });

    return !!data;
  } catch (error) {
    logger.error('Error checking permission:', error);
    return false;
  }
}

export async function assignRole(
  userId: string,
  role: UserRole,
  assignedBy: string
): Promise<boolean> {
  try {
    // Check if assigner has permission
    const canManageRoles = await checkPermission(assignedBy, 'manage_roles');
    if (!canManageRoles) {
      throw new Error('Unauthorized to manage roles');
    }

    // Update user's role
    const { error } = await supabase
      .from('user_profiles')
      .update({ role })
      .eq('id', userId);

    if (error) throw error;

    // Log the activity
    await supabase.rpc('log_user_activity', {
      action: 'role_assigned',
      details: { user_id: userId, role, assigned_by: assignedBy }
    });

    return true;
  } catch (error) {
    logger.error('Error assigning role:', error);
    return false;
  }
}