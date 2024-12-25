```typescript
import React from 'react';
import { Paperclip } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { ThreadMessage as ThreadMessageType } from '../../types/messaging';

interface ThreadMessageProps {
  message: ThreadMessageType;
}

export function ThreadMessage({ message }: ThreadMessageProps) {
  const { sender } = message;
  const hasAttachments = message.attachments.length > 0;

  return (
    <div className={cn(
      "flex flex-col max-w-[75%]",
      sender.role === 'client' ? "ml-auto" : "mr-auto"
    )}>
      <div className="flex items-center space-x-2 mb-1">
        <span className="text-sm font-medium text-gray-900">{sender.name}</span>
        <span className="text-xs text-gray-500">
          {new Date(message.createdAt).toLocaleString()}
        </span>
      </div>

      <div className={cn(
        "rounded-lg px-4 py-2",
        sender.role === 'client'
          ? "bg-indigo-600 text-white"
          : "bg-gray-100 text-gray-900"
      )}>
        <p>{message.content}</p>

        {hasAttachments && (
          <div className="mt-2 space-y-1">
            {message.attachments.map((attachment) => (
              <a
                key={attachment.url}
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center space-x-2 text-sm",
                  sender.role === 'client'
                    ? "text-indigo-100 hover:text-white"
                    : "text-indigo-600 hover:text-indigo-700"
                )}
              >
                <Paperclip className="h-4 w-4" />
                <span>{attachment.name}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```