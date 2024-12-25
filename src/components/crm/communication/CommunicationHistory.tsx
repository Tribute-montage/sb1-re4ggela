```typescript
import React from 'react';
import { useCommunicationHistory } from '../../../hooks/crm/useCommunicationHistory';

interface CommunicationHistoryProps {
  clientId: string;
}

export function CommunicationHistory({ clientId }: CommunicationHistoryProps) {
  const { messages, loading } = useCommunicationHistory(clientId);

  if (loading) {
    return <div className="animate-pulse space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-20 bg-gray-100 rounded" />
      ))}
    </div>;
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "p-4 rounded-lg",
            message.sender.role === 'client'
              ? "bg-indigo-50 ml-8"
              : "bg-gray-50 mr-8"
          )}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="font-medium text-gray-900">
              {message.sender.name}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(message.timestamp).toLocaleString()}
            </span>
          </div>
          <p className="text-gray-700">{message.content}</p>
        </div>
      ))}
    </div>
  );
}
```