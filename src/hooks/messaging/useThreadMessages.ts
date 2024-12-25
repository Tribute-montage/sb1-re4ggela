```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';
import type { ThreadMessage } from '../../types/messaging';

export function useThreadMessages(threadId: string) {
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('thread_messages')
          .select(`
            *,
            sender:user_profiles(*)
          `)
          .eq('thread_id', threadId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching thread messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Set up real-time subscription
    const subscription = supabase
      .channel(`thread_messages:${threadId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'thread_messages',
        filter: `thread_id=eq.${threadId}`
      }, fetchMessages)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [threadId]);

  const sendMessage = async (content: string, attachments: File[] = []) => {
    try {
      // Upload attachments if any
      const uploadedAttachments = await Promise.all(
        attachments.map(async (file) => {
          const fileName = `${Date.now()}_${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from('message_attachments')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('message_attachments')
            .getPublicUrl(fileName);

          return {
            name: file.name,
            url: publicUrl,
            type: file.type,
            size: file.size,
          };
        })
      );

      // Send message
      const { error } = await supabase.rpc('send_thread_message', {
        p_thread_id: threadId,
        p_content: content,
        p_attachments: uploadedAttachments,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  return {
    messages,
    loading,
    sendMessage,
  };
}
```