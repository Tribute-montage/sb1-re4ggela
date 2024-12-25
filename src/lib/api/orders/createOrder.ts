import { supabase } from '../../supabase/client';
import { Order } from '../../../types/order';

export async function createOrder(order: Omit<Order, 'id'>): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select()
    .single();

  if (error) throw error;
  return data;
}