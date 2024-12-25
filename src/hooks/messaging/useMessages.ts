```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';
import type { Message } from '../../types/messaging';

export function useMessages(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            sender:user_profiles(*)
          `)
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        setMessages(data.map(msg => ({
          ...msg,
          isOwn: msg.sender_id === user.id
        })));
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Set up real-time subscription
    const subscription = supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, fetchMessages)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [conversationId]);

  return { messages, loading };
}
```