```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import { toast } from 'sonner';

export function useOrderStatus(orderId: string) {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription: any;

    async function fetchStatus() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('status')
          .eq('id', orderId)
          .single();

        if (error) throw error;
        setStatus(data.status);
      } catch (error) {
        console.error('Error fetching order status:', error);
      } finally {
        setLoading(false);
      }
    }

    // Set up real-time subscription
    subscription = supabase
      .channel(`order:${orderId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`
      }, (payload) => {
        const newStatus = payload.new.status;
        if (newStatus !== status) {
          setStatus(newStatus);
          toast.info(`Order status updated to ${newStatus}`);
        }
      })
      .subscribe();

    fetchStatus();

    return () => {
      subscription?.unsubscribe();
    };
  }, [orderId]);

  return { status, loading };
}
```