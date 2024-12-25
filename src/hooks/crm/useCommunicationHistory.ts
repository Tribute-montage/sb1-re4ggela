```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: {
    id: string;
    name: string;
    role: 'admin' | 'editor' | 'client';
  };
}

export function useCommunicationHistory(clientId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('client_messages')
          .select(`
            id,
            content,
            created_at,
            sender:user_profiles (
              id,
              full_name,
              role
            )
          `)
          .eq('client_id', clientId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setMessages(data.map(msg => ({
          id: msg.id,
          content: msg.content,
          timestamp: msg.created_at,
          sender: {
            id: msg.sender.id,
            name: msg.sender.full_name,
            role: msg.sender.role
          }
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
      .channel(`client_messages:${clientId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'client_messages',
        filter: `client_id=eq.${clientId}`
      }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [clientId]);

  return { messages, loading };
}
```