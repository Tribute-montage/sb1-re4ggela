```typescript
import React from 'react';
import { useConversations } from '../../hooks/messaging/useConversations';
import { ConversationItem } from './ConversationItem';
import { cn } from '../../lib/utils';

interface ConversationListProps {
  selectedId?: string;
  onSelect: (id: string) => void;
}

export function ConversationList({ selectedId, onSelect }: ConversationListProps) {
  const { conversations, loading } = useConversations();

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isSelected={conversation.id === selectedId}
          onClick={() => onSelect(conversation.id)}
        />
      ))}
    </div>
  );
}
```