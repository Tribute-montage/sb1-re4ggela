import { supabase } from '../../supabase/client';

export async function getPerformanceMetrics() {
  const { data, error } = await supabase.rpc('get_performance_metrics');
  if (error) throw error;
  return data;
}