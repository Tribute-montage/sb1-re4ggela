```typescript
import React from 'react';
import { MessageSquare, Mail, Bell, Settings } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { CommunicationHistory } from './CommunicationHistory';
import { MessageComposer } from './MessageComposer';
import { NotificationPreferences } from './NotificationPreferences';

interface CommunicationCenterProps {
  clientId: string;
}

export function CommunicationCenter({ clientId }: CommunicationCenterProps) {
  const [activeTab, setActiveTab] = useState('messages');

  const tabs = [
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'email', label: 'Email History', icon: Mail },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Settings },
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 px-4 py-4 text-center border-b-2 font-medium text-sm",
                activeTab === tab.id
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              <tab.icon className="h-5 w-5 mx-auto mb-1" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <CommunicationHistory clientId={clientId} />
            <MessageComposer clientId={clientId} />
          </div>
        )}
        {activeTab === 'email' && (
          <EmailHistory clientId={clientId} />
        )}
        {activeTab === 'notifications' && (
          <NotificationHistory clientId={clientId} />
        )}
        {activeTab === 'preferences' && (
          <NotificationPreferences clientId={clientId} />
        )}
      </div>
    </div>
  );
}
```