import { supabase } from '../../supabase/client';
import { Order } from '../../../types/order';

export async function getOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('client_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}