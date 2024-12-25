import { supabase } from '../../supabase/client';

export async function getOrderMedia(orderId: string) {
  const { data, error } = await supabase
    .from('order_media')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}