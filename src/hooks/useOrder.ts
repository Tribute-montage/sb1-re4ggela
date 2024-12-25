import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import { Order } from '../types/order';
import { toast } from 'sonner';

export function useOrder(orderId: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription: any;

    async function fetchOrder() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (error) throw error;
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Failed to load order');
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
        setOrder(payload.new as Order);
      })
      .subscribe();

    fetchOrder();

    return () => {
      subscription?.unsubscribe();
    };
  }, [orderId]);

  return { order, loading };
}