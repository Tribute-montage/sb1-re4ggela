import React from 'react';
import { useNotificationSettings } from '../../hooks/useNotificationSettings';
import { Switch } from '../ui/Switch';
import { cn } from '../../lib/utils';

const NOTIFICATION_TYPES = [
  { id: 'draft_ready', label: 'Draft Ready for Review' },
  { id: 'client_feedback', label: 'Client Feedback Received' },
  { id: 'order_status', label: 'Order Status Updates' },
];

export function NotificationSettings() {
  const { settings, loading, updateSettings } = useNotificationSettings();

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-10 bg-gray-200 rounded" />
      <div className="h-32 bg-gray-100 rounded" />
    </div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage how you receive notifications about your orders and updates.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {/* Delivery Methods */}
        <div className="p-6 space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Delivery Methods</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onChange={(checked) => updateSettings({ emailNotifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">In-App Notifications</p>
                <p className="text-sm text-gray-500">Receive notifications in the dashboard</p>
              </div>
              <Switch
                checked={settings.inAppNotifications}
                onChange={(checked) => updateSettings({ inAppNotifications: checked })}
              />
            </div>
          </div>
        </div>

        {/* Notification Types */}
        <div className="p-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Notification Types</h4>
          <div className="space-y-4">
            {NOTIFICATION_TYPES.map((type) => (
              <div key={type.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={type.id}
                  checked={settings.notificationTypes.includes(type.id)}
                  onChange={(e) => {
                    const types = e.target.checked
                      ? [...settings.notificationTypes, type.id]
                      : settings.notificationTypes.filter(t => t !== type.id);
                    updateSettings({ notificationTypes: types });
                  }}
                  className={cn(
                    "h-4 w-4 rounded border-gray-300 text-indigo-600",
                    "focus:ring-indigo-500"
                  )}
                />
                <label htmlFor={type.id} className="ml-3 text-sm text-gray-700">
                  {type.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}