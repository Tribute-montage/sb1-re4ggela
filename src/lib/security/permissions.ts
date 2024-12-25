import { supabase } from '../supabase/client';

export type Permission = 
  | 'upload_media'
  | 'delete_media'
  | 'edit_order'
  | 'view_order'
  | 'manage_users'
  | 'manage_assets'
  | 'view_analytics';

export type Role = 'client' | 'editor' | 'admin' | 'super_admin';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  client: ['upload_media', 'view_order'],
  editor: ['upload_media', 'edit_order', 'view_order'],
  admin: [
    'upload_media',
    'delete_media',
    'edit_order',
    'view_order',
    'manage_assets',
    'view_analytics'
  ],
  super_admin: [
    'upload_media',
    'delete_media',
    'edit_order',
    'view_order',
    'manage_users',
    'manage_assets',
    'view_analytics'
  ],
};

export async function hasPermission(
  userId: string,
  permission: Permission
): Promise<boolean> {
  try {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (!profile) return false;

    const permissions = ROLE_PERMISSIONS[profile.role as Role];
    return permissions.includes(permission);
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
}

export async function checkPermissions(
  userId: string,
  permissions: Permission[]
): Promise<boolean> {
  try {
    const results = await Promise.all(
      permissions.map(permission => hasPermission(userId, permission))
    );
    return results.every(Boolean);
  } catch (error) {
    console.error('Error checking permissions:', error);
    return false;
  }
}