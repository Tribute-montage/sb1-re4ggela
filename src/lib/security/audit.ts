import { supabase } from '../supabase/client';

export async function logSecurityEvent(
  action: string,
  resourceType: string,
  resourceId: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    await supabase.rpc('log_security_event', {
      p_action: action,
      p_resource_type: resourceType,
      p_resource_id: resourceId,
      p_metadata: metadata
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}

export const AUDIT_ACTIONS = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  PASSWORD_CHANGE: 'password_change',
  PROFILE_UPDATE: 'profile_update',
  ORDER_CREATE: 'order_create',
  ORDER_UPDATE: 'order_update',
  MEDIA_UPLOAD: 'media_upload',
  MEDIA_DELETE: 'media_delete',
  SETTINGS_CHANGE: 'settings_change',
} as const;