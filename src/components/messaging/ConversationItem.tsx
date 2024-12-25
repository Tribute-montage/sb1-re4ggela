```typescript
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../../lib/utils';
import type { Conversation } from '../../types/messaging';

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

export function ConversationItem({ conversation, isSelected, onClick }: ConversationItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-lg transition-colors",
        isSelected
          ? "bg-indigo-50 hover:bg-indigo-100"
          : "hover:bg-gray-50"
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-gray-900 truncate">
            {conversation.title || conversation.participants.map(p => p.name).join(', ')}
          </h4>
          {conversation.lastMessage && (
            <p className="text-sm text-gray-500 truncate mt-1">
              {conversation.lastMessage.content}
            </p>
          )}
        </div>
        {conversation.lastMessage && (
          <span className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), { addSuffix: true })}
          </span>
        )}
      </div>
    </button>
  );
}
```