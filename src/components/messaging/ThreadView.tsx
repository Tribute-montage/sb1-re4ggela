```typescript
import React, { useEffect, useRef } from 'react';
import { useThreadMessages } from '../../hooks/messaging/useThreadMessages';
import { MessageComposer } from './MessageComposer';
import { ThreadMessage } from './ThreadMessage';
import { cn } from '../../lib/utils';

interface ThreadViewProps {
  threadId: string;
  subject: string;
}

export function ThreadView({ threadId, subject }: ThreadViewProps) {
  const { messages, loading, sendMessage } = useThreadMessages(threadId);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-medium text-gray-900">{subject}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-20 bg-gray-100 rounded-lg animate-pulse",
                  i % 2 === 0 ? "ml-12" : "mr-12"
                )}
              />
            ))}
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ThreadMessage key={message.id} message={message} />
            ))}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Composer */}
      <div className="p-4 border-t">
        <MessageComposer onSend={sendMessage} />
      </div>
    </div>
  );
}
```