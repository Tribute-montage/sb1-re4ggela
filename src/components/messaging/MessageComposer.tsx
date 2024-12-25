```typescript
import React, { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { useMessaging } from '../../hooks/messaging/useMessaging';
import { cn } from '../../lib/utils';

interface MessageComposerProps {
  conversationId: string;
}

export function MessageComposer({ conversationId }: MessageComposerProps) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const { sendMessage, sending } = useMessaging(conversationId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && attachments.length === 0) return;

    try {
      await sendMessage(message);
      setMessage('');
      setAttachments([]);
    } catch (error) {
      // Error is handled by useMessaging hook
    }
  };

  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          rows={3}
          disabled={sending}
          className={cn(
            "block w-full rounded-lg border-gray-300 shadow-sm",
            "focus:border-indigo-500 focus:ring-indigo-500",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        />
        <div className="absolute bottom-2 right-2 flex space-x-2">
          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleAttachment}
              disabled={sending}
            />
            <Paperclip className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </label>
        </div>
      </div>

      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((file) => (
            <div
              key={file.name}
              className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm"
            >
              <span className="truncate max-w-xs">{file.name}</span>
              <button
                type="button"
                onClick={() => setAttachments(prev => 
                  prev.filter(f => f !== file)
                )}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={(!message.trim() && attachments.length === 0) || sending}
          className={cn(
            "inline-flex items-center px-4 py-2 border border-transparent",
            "rounded-md shadow-sm text-sm font-medium text-white",
            "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2",
            "focus:ring-offset-2 focus:ring-indigo-500",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <Send className="h-4 w-4 mr-2" />
          Send
        </button>
      </div>
    </form>
  );
}
```