import { supabase } from '../../../lib/supabase/client';
import type { Order } from '../../../types/editor';

export async function fetchOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('editor_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}