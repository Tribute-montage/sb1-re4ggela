import { supabase } from '../supabase/client';
import { Order } from '../../types/order';
import { logger } from '../core/logger';

export async function getOrders(userId: string): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('client_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error('Error fetching orders:', error);
    throw error;
  }
}

export async function getOrder(orderId: string): Promise<Order> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Order not found');
    
    return data;
  } catch (error) {
    logger.error('Error fetching order:', error);
    throw error;
  }
}

export async function createOrder(order: Omit<Order, 'id'>): Promise<Order> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to create order');
    
    return data;
  } catch (error) {
    logger.error('Error creating order:', error);
    throw error;
  }
}

export async function updateOrder(
  orderId: string,
  updates: Partial<Order>
): Promise<Order> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Order not found');
    
    return data;
  } catch (error) {
    logger.error('Error updating order:', error);
    throw error;
  }
}