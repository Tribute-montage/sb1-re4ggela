import { useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase/client';

interface AdminSettings {
  emailNotifications: boolean;
  autoAssignOrders: boolean;
  defaultDeliveryDays: number;
  workingHours: {
    start: string;
    end: string;
  };
}

export function useAdminSettings() {
  const [settings, setSettings] = useState<AdminSettings>({
    emailNotifications: true,
    autoAssignOrders: false,
    defaultDeliveryDays: 7,
    workingHours: {
      start: '09:00',
      end: '17:00',
    },
  });
  const [loading, setLoading] = useState(true);

  const updateSettings = useCallback(async (newSettings: Partial<AdminSettings>) => {
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({ settings: newSettings });

      if (error) throw error;
      setSettings(prev => ({ ...prev, ...newSettings }));
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }, []);

  return { settings, updateSettings, loading };
}