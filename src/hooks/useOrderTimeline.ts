import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';

interface TimelineEvent {
  id: string;
  orderId: string;
  type: 'status_change' | 'note' | 'media_upload';
  description: string;
  timestamp: string;
}

export function useOrderTimeline(orderId: string) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription: any;

    async function fetchTimeline() {
      try {
        const { data, error } = await supabase
          .from('order_timeline')
          .select('*')
          .eq('order_id', orderId)
          .order('timestamp', { ascending: false });

        if (error) throw error;
        setEvents(data);
      } catch (error) {
        console.error('Error fetching timeline:', error);
      } finally {
        setLoading(false);
      }
    }

    // Set up real-time subscription
    subscription = supabase
      .channel(`timeline:${orderId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'order_timeline',
        filter: `order_id=eq.${orderId}`
      }, () => {
        fetchTimeline();
      })
      .subscribe();

    fetchTimeline();

    return () => {
      subscription?.unsubscribe();
    };
  }, [orderId]);

  return { events, loading };
}