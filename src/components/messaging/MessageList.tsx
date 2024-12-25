```typescript
import React, { useRef, useEffect } from 'react';
import { useMessages } from '../../hooks/messaging/useMessages';
import { MessageBubble } from './MessageBubble';
import { cn } from '../../lib/utils';

interface MessageListProps {
  conversationId: string;
}

export function MessageList({ conversationId }: MessageListProps) {
  const { messages, loading } = useMessages(conversationId);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-12 bg-gray-100 rounded-lg w-2/3 animate-pulse",
              i % 2 === 0 ? "ml-auto" : ""
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
```