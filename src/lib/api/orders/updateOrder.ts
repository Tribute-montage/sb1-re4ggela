import { supabase } from '../../supabase/client';
import { Order } from '../../../types/order';

export async function updateOrder(
  orderId: string,
  updates: Partial<Order>
): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}