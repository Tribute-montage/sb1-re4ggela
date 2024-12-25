import { supabase } from '../../supabase/client';

export async function getOrderMetrics() {
  const { data, error } = await supabase.rpc('get_order_metrics');
  if (error) throw error;
  return data;
}