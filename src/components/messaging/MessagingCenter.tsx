```typescript
import React, { useState } from 'react';
import { ConversationList } from './ConversationList';
import { MessageList } from './MessageList';
import { MessageComposer } from './MessageComposer';
import { cn } from '../../lib/utils';

export function MessagingCenter() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  return (
    <div className="flex h-[600px] bg-white rounded-lg shadow overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-200">
        <ConversationList
          selectedId={selectedConversation || undefined}
          onSelect={setSelectedConversation}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <MessageList conversationId={selectedConversation} />
            <div className="border-t border-gray-200 p-4">
              <MessageComposer conversationId={selectedConversation} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
```