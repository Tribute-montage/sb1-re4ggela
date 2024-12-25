```typescript
export interface User {
  id: string;
  name: string;
  role: 'admin' | 'editor' | 'client';
}

export interface Attachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface ThreadMessage {
  id: string;
  threadId: string;
  content: string;
  attachments: Attachment[];
  sender: User;
  status: 'sent' | 'delivered' | 'read';
  createdAt: string;
}

export interface MessageThread {
  id: string;
  orderId: string;
  subject: string;
  participants: User[];
  lastMessage?: ThreadMessage;
  createdAt: string;
  updatedAt: string;
}
```