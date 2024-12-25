```typescript
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    role: 'admin' | 'editor' | 'client';
  };
  timestamp: string;
}

interface ProjectChatProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export function ProjectChat({ messages, onSendMessage }: ProjectChatProps) {
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-lg shadow">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">{message.sender.name}</span>
              <span className="text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleString()}
              </span>
            </div>
            <div className="mt-1 text-gray-700 bg-gray-50 rounded-lg p-3">
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className={cn(
              "inline-flex items-center px-4 py-2 border border-transparent",
              "rounded-md shadow-sm text-sm font-medium text-white",
              "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2",
              "focus:ring-offset-2 focus:ring-indigo-500"
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
```