```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';
import type { Conversation } from '../../types/messaging';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
          .from('conversations')
          .select(`
            *,
            participants:conversation_participants(
              user:user_profiles(*)
            ),
            last_message:messages(
              id,
              content,
              type,
              created_at,
              sender:user_profiles(*)
            )
          `)
          .order('updated_at', { ascending: false });

        if (error) throw error;

        setConversations(data || []);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    // Set up real-time subscription
    const subscription = supabase
      .channel('conversations')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'conversations',
      }, fetchConversations)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { conversations, loading };
}
```