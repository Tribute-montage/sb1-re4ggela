import React from 'react';
import { useAdminSettings } from '../../hooks/admin/useAdminSettings';
import { SettingsForm } from '../../components/admin/settings/SettingsForm';

export function AdminSettings() {
  const { settings, updateSettings, loading } = useAdminSettings();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
      </div>

      {loading ? (
        <div className="animate-pulse h-32 bg-gray-100 rounded-lg" />
      ) : (
        <SettingsForm settings={settings} onSubmit={updateSettings} />
      )}
    </div>
  );
}