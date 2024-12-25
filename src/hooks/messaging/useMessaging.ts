```typescript
import { useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase/client';
import { toast } from 'sonner';

export function useMessaging(conversationId: string) {
  const [sending, setSending] = useState(false);

  const sendMessage = useCallback(async (content: string, type: 'text' | 'file' = 'text') => {
    setSending(true);
    try {
      const { error } = await supabase.rpc('send_message', {
        p_conversation_id: conversationId,
        p_content: content,
        p_type: type
      });

      if (error) throw error;
      toast.success('Message sent');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      throw error;
    } finally {
      setSending(false);
    }
  }, [conversationId]);

  const startConversation = useCallback(async (
    participants: string[],
    title?: string
  ) => {
    try {
      const { data, error } = await supabase.rpc('start_conversation', {
        p_title: title,
        p_type: participants.length > 2 ? 'group' : 'direct',
        p_participants: participants
      });

      if (error) throw error;
      toast.success('Conversation started');
      return data;
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('Failed to start conversation');
      throw error;
    }
  }, []);

  return {
    sendMessage,
    startConversation,
    sending
  };
}
```