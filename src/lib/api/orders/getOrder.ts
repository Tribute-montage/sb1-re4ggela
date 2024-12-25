import { supabase } from '../../supabase/client';
import { Order } from '../../../types/order';

export async function getOrder(orderId: string): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (error) throw error;
  if (!data) throw new Error('Order not found');
  
  return data;
}