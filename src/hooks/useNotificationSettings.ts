import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase/client';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'sonner';

interface NotificationSettings {
  emailNotifications: boolean;
  inAppNotifications: boolean;
  notificationTypes: string[];
}

export function useNotificationSettings() {
  const { user } = useAuthStore();
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    inAppNotifications: true,
    notificationTypes: ['draft_ready', 'client_feedback', 'order_status'],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from('notification_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (data) {
          setSettings({
            emailNotifications: data.email_notifications,
            inAppNotifications: data.in_app_notifications,
            notificationTypes: data.notification_types,
          });
        }
      } catch (error) {
        console.error('Error fetching notification settings:', error);
        toast.error('Failed to load notification settings');
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, [user]);

  const updateSettings = useCallback(async (newSettings: Partial<NotificationSettings>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notification_settings')
        .upsert({
          user_id: user.id,
          email_notifications: newSettings.emailNotifications,
          in_app_notifications: newSettings.inAppNotifications,
          notification_types: newSettings.notificationTypes,
        });

      if (error) throw error;

      setSettings(prev => ({ ...prev, ...newSettings }));
      toast.success('Notification settings updated');
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast.error('Failed to update notification settings');
    }
  }, [user]);

  return {
    settings,
    loading,
    updateSettings,
  };
}