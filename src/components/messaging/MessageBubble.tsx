```typescript
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Paperclip } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Message } from '../../types/messaging';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isFile = message.type === 'file';

  return (
    <div
      className={cn(
        "flex flex-col max-w-[70%]",
        message.isOwn ? "ml-auto items-end" : "mr-auto items-start"
      )}
    >
      <div
        className={cn(
          "rounded-lg px-4 py-2",
          message.isOwn
            ? "bg-indigo-600 text-white"
            : "bg-gray-100 text-gray-900"
        )}
      >
        {isFile ? (
          <a
            href={message.content}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 hover:underline"
          >
            <Paperclip className="h-4 w-4" />
            <span>{message.metadata?.fileName || 'Attachment'}</span>
          </a>
        ) : (
          <p>{message.content}</p>
        )}
      </div>
      <div className="flex items-center mt-1 space-x-2">
        <span className="text-xs text-gray-500">
          {message.sender.name}
        </span>
        <span className="text-xs text-gray-400">
          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}
```