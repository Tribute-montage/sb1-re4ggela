import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';
import type { Order } from '../../types/order';

export function useRecentOrders(limit = 5) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching recent orders:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [limit]);

  return { orders, loading };
}